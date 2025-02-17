import { database } from "@cobuild/database";
import { OnchainEvent } from "prisma-database";

import getOrCreateVote from "./creators/getOrCreateVote";
import { isAlreadyUpdated } from "../../../../utils";
import { GovernanceType } from "@cobuild/database/types";

export interface IVoteCastDecodedEvent {
  voter: `0x${string}`;
  proposalId: string;
  support: number;
  votes: bigint;
  reason: string;
}

export const handleVoteCastEvent = async (
  args: IVoteCastDecodedEvent,
  entityId: string,
  tokenContract: string | undefined,
  event: OnchainEvent,
  eventTimestamp: Date,
  type: GovernanceType,
) => {
  const vote = await getOrCreateVote(
    args,
    entityId,
    tokenContract,
    event.blockNumber,
    event,
    eventTimestamp,
    type,
  );

  if (vote.countedInProposal) return;

  const proposal = await database.proposal.findFirst({
    where: { proposalId: vote.proposalId, entityId: entityId },
  });

  if (!proposal) throw new Error(`No proposal found for id  ${vote.proposalId} entity ${entityId}`);

  if (proposal.status === "pending") {
    await database.proposal.update({
      where: { id: proposal.id },
      data: {
        status: "active",
      },
    });
  }

  const options = proposal.options as { [key: string]: any };

  const voteCount = BigInt(options[vote.optionId].voteCount);

  options[vote.optionId].voteCount = (voteCount + BigInt(vote.weight)).toString();

  options[vote.optionId].uniqueVotes += 1;

  if (!isAlreadyUpdated(event, proposal.lastUpdated)) {
    await database.proposal.update({
      where: { id: proposal.id },
      data: {
        options: options as any,
        totalUniqueVotes: proposal.totalUniqueVotes + 1,
        totalVotes: (BigInt(proposal.totalVotes) + BigInt(vote.weight)).toString(),
        lastUpdated: {
          blockNumber: event.blockNumber,
          transactionIndex: event.transactionIndex || 0,
          logIndex: event.logIndex || 0,
        },
      },
    });
  }

  if (!isAlreadyUpdated(event, vote.lastUpdated)) {
    console.log(`Updating vote ${vote.id} to countedInProposal`);
    await database.vote.update({
      where: { id: vote.id },
      data: {
        countedInProposal: true,
        lastUpdated: {
          blockNumber: event.blockNumber,
          transactionIndex: event.transactionIndex || 0,
          logIndex: event.logIndex || 0,
        },
      },
    });
  }
};
