import { processTransactions } from "@cobuild/libs/governance/proposals";
import { PresetOption, getOptionColor, isPresetOption } from "@cobuild/libs/governance/voting";
import find from "lodash/find";
import { Proposal } from "prisma-database";
import { IProposal, ProposalOption } from "../../types";
import { ProposalOptionsDB } from "./IProposal";
import { getFundedAmountsForProposal } from "./libs/BudgetLib";
import {
  getQuorumForV1Proposal,
  getQuorumForProposal,
} from "@cobuild/libs/governance/quorum/getQuorum";

export function transformProposal(proposal: Proposal): IProposal {
  const options = transformOptions(proposal.options as any, proposal.totalVotes);

  const governanceContract = proposal.governanceContract as `0x${string}`;
  const trackerType = proposal.trackerType;

  return Object.assign(proposal, {
    title: getTitle(proposal.title, proposal.description),
    budget: getBudget(proposal.options),
    proposer: proposal.proposer as `0x${string}`,
    numericId: parseInt(proposal.proposalId) > 0 ? parseInt(proposal.proposalId) : null,
    transactions: processTransactions(
      proposal.targets,
      proposal.calldatas,
      proposal.values,
      proposal.signatures,
    ),
    votesCount: {
      total: BigInt(proposal.totalVotes).toString(),
      totalUnique: proposal.totalUniqueVotes,
      for: getVotesCount("For", proposal),
      abstain: getVotesCount("Abstain", proposal),
      against: getVotesCount("Against", proposal),
    },
    quorum: async () => {
      if (trackerType === "nouns_dao_v1") {
        return getQuorumForV1Proposal(governanceContract, proposal.chainId);
      }

      return getQuorumForProposal(proposal.proposalId, governanceContract, proposal.chainId);
    },
    options,
    hasPresetOptions: !options.some(o => o.preset === null),
  });
}

export function getTitle(title: string | null, description: string) {
  if (title && title.length > 2) return title;

  // handle Nouns Builder HTML titles (formatted as: "title&&body")
  if (description.slice(0, 100).includes("&&")) {
    return description.slice(0, 100).split("&&")[0];
  }

  // description text sometimes contains extra quotes so we remove it
  if (description.startsWith('"') && description.endsWith('"')) {
    description = description.slice(1, -1);
  }

  // taken from nouns-monorepo
  description = description.replace(/\\n/g, "\n");

  const hashRegex = /^\s*#{1,6}\s+([^\n]+)/;
  const equalTitleRegex = /^\s*([^\n]+)\n(={3,25}|-{3,25})/;
  /**
   * Extract a markdown title from a proposal description that uses the `# Title` format
   * Returns null if no title found.
   */
  const extractHashTitle = (description: string) => description.match(hashRegex);
  /**
   * Extract a markdown title from a proposal description that uses the `Title\n===` format.
   * Returns null if no title found.
   */
  const extractEqualTitle = (description: string) => description.match(equalTitleRegex);

  /**
   * Extract title from a proposal's description/description. Returns null if no title found in the first line.
   * @param description proposal description
   */
  if (!description) return null;

  const hashResult = extractHashTitle(description);
  const equalResult = extractEqualTitle(description);
  const fallbackTitle = description.slice(0, 70);

  return hashResult ? hashResult[1] : equalResult ? equalResult[1] : fallbackTitle;
}

function getBudget(options: Proposal["options"]): { amount: number; unit: "eth" | "usd" } {
  const { payouts, eth, usdc } = getFundedAmountsForProposal(options);

  if (payouts?.length === 0) return { amount: 0, unit: "eth" };
  if (usdc) return { amount: usdc, unit: "usd" };

  return { amount: eth, unit: "eth" };
}

function getVotesCount(optionName: string, proposal: Proposal): string {
  if (BigInt(proposal.totalVotes) === BigInt(0)) return "0";
  return find(proposal.options as ProposalOptionsDB, o => o.name === optionName)?.voteCount || "0";
}

function transformOptions(dbOptions: ProposalOptionsDB, totalVotes: string): ProposalOption[] {
  const options = Object.keys(dbOptions).map(key => {
    const option = dbOptions[parseInt(key)];

    return {
      name: option.name,
      executionData: option.executionData,
      preset: isPresetOption(option.name) ? option.name : null,
      voteCount: option.voteCount || "0",
      uniqueVotes: option.uniqueVotes || 0,
      color: getOptionColor(option.name),
      optionId: parseInt(key),
    };
  });

  return sortOptions(options);
}

function sortOptions(options: ProposalOption[]) {
  if (options.some(o => o.preset === null)) return options; // Do not sort custom options

  const order = { For: 1, Abstain: 2, Against: 3 };
  options.sort((a, b) => order[a.preset as PresetOption] - order[b.preset as PresetOption]);
  return options;
}
