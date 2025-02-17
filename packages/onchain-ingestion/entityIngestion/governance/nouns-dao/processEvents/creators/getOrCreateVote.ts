import { Vote, GovernanceType } from "prisma-database";
import { OnchainEvent } from "prisma-database";
import { IVoteCastDecodedEvent } from "../voteCast";
import { database } from "@cobuild/database";

const getOrCreateVote = async (
  args: IVoteCastDecodedEvent,
  entityId: string,
  tokenContract: string | undefined,
  block: number,
  event: OnchainEvent,
  blockTimestamp: Date,
  type: GovernanceType,
): Promise<Vote> => {
  const proposalId = args.proposalId.toString();
  const voter = args.voter.toLowerCase();
  const uniqueId = `${entityId}-${voter}-${proposalId}`;
  const votesDecimal = args.votes;
  const reason = args.reason || "";

  const doc: Omit<Vote, "id" | "name"> = {
    proposalId,
    v: null,
    updatedAt: new Date(),
    chainId: event.chainId,
    blockchain: "ethereum",
    uniqueId,
    votedAt: {
      block,
      time: blockTimestamp,
    },
    network: "mainnet",
    type: type === "revolution" ? "revolution" : "nouns",
    entityId,
    reason,
    tokenContract: tokenContract ?? null,
    optionId: args.support,
    weight: votesDecimal.toString(),
    voter: voter.toLowerCase(),
    countedInProposal: false,
    lastUpdated: {
      blockNumber: 0,
      transactionIndex: 0,
      logIndex: 0,
    },
  };

  console.log(`Upserting vote ${uniqueId}`);

  return await database.vote.upsert({
    where: { uniqueId },
    create: doc,
    update: doc,
  });
};

export default getOrCreateVote;
