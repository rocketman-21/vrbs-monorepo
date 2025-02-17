import { database } from "@cobuild/database";
import { OnchainEvent } from "prisma-database";
import { Proposals } from "@cobuild/database/models/governance/Proposals";
import { getProposalPayoutAndExecutionData } from "../creators/generateProposal";

//helper function to update proposal description
export const updateProposalDescription = async (
  proposalId: string,
  description: string,
  entityId: string,
  event: OnchainEvent,
) => {
  await database.proposal.update({
    where: { proposalId_entityId: { entityId, proposalId } },
    data: {
      description,
      lastUpdated: {
        blockNumber: event.blockNumber,
        transactionIndex: event.transactionIndex || 0,
        logIndex: event.logIndex || 0,
      },
    },
  });
};

interface IProposalTransactionsUpdated {
  id: bigint;
  proposer: `0x${string}`;
  targets: readonly `0x${string}`[];
  values: readonly bigint[];
  signatures: readonly string[];
  calldatas: readonly `0x${string}`[];
  updateMessage: string;
}

//helper function to update proposal transactions
export const updateProposalTransactions = async (
  args: IProposalTransactionsUpdated,
  entityId: string,
  event: OnchainEvent,
) => {
  const { id, targets, values, signatures, calldatas } = args;
  const proposalId = id.toString();

  const proposal = await Proposals().findById(proposalId, entityId);

  if (!proposal) {
    throw new Error(`No proposal found to update txns for id  ${proposalId} entity ${entityId}`);
  }

  const { totalPayout, executionDatas } = getProposalPayoutAndExecutionData({
    targets,
    values,
    signatures,
    calldatas,
  });

  await database.proposal.update({
    where: { proposalId_entityId: { entityId, proposalId } },
    data: {
      payoutAmount: totalPayout as any,
      targets: [...args.targets.map(target => target.toLowerCase())],
      values: args.values.map(d => d.toString()),
      signatures: [...args.signatures],
      calldatas: [...args.calldatas],
      options: {
        "0": {
          name: "Against",
          voteCount: proposal.options["0"].voteCount,
          uniqueVotes: proposal.options["0"].uniqueVotes,
          executionData: [],
        },
        "1": {
          name: "For",
          voteCount: proposal.options["1"].voteCount,
          uniqueVotes: proposal.options["1"].uniqueVotes,
          executionData: executionDatas,
        },
        "2": {
          name: "Abstain",
          voteCount: proposal.options["2"].voteCount,
          uniqueVotes: proposal.options["2"].uniqueVotes,
          executionData: [],
        },
      },
      lastUpdated: {
        blockNumber: event.blockNumber,
        transactionIndex: event.transactionIndex || 0,
        logIndex: event.logIndex || 0,
      },
    },
  });
};

//update proposal description and transactions, using above 2 functions, taking as a parameters IProposalTransactionsUpdated & {description:string}
export const updateProposalDescriptionAndTransactions = async (
  args: IProposalTransactionsUpdated & { description: string },
  entityId: string,
  event: OnchainEvent,
) => {
  const { id, description } = args;
  const proposalId = id.toString();

  await updateProposalDescription(proposalId, description, entityId, event);
  await updateProposalTransactions(args, entityId, event);
};
