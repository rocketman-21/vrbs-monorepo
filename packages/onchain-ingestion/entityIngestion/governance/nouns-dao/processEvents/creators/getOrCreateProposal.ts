import { Proposal, GovernanceType, TrackerType } from "prisma-database";
import { OnchainEvent } from "prisma-database";
import { database } from "@cobuild/database";
import { generateNounishProposal } from "./generateProposal";

interface IProposalCreatedDecodedEvent {
  id: string;
  proposer: `0x${string}`;
  targets: readonly `0x${string}`[];
  values: readonly bigint[];
  signatures: readonly string[];
  calldatas: readonly `0x${string}`[];
  startBlock?: bigint;
  endBlock?: bigint;
  startTimestamp?: number; // for nouns builder
  endTimestamp?: number; // for nouns builder
  proposalThreshold: bigint;
  description: string;
}

const getOrCreateProposal = async (
  args: IProposalCreatedDecodedEvent,
  entityId: string,
  tokenContract: string | undefined,
  type: GovernanceType,
  event: OnchainEvent,
  blockTimestamp: Date,
  trackerType: TrackerType,
): Promise<Proposal> => {
  const doc = generateNounishProposal(
    args,
    entityId,
    tokenContract,
    event,
    blockTimestamp,
    type,
    trackerType,
  );
  const { uniqueId, proposalId } = doc;

  console.log(`Upserting proposal ${uniqueId}`);

  return await database.proposal.upsert({
    where: {
      uniqueId,
      proposalId,
      entityId: entityId,
      blockchain: "ethereum",
      network: "mainnet",
    },
    create: { ...doc, options: doc.options as any, payoutAmount: doc.payoutAmount as any },
    update: { ...doc, options: doc.options as any, payoutAmount: doc.payoutAmount as any },
  });
};

export default getOrCreateProposal;
