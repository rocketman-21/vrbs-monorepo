import { database } from "@cobuild/database";
import { Proposals } from "@cobuild/database/models/governance/Proposals";
import { ProposalStatus } from "prisma-database";
import { OnchainEvent } from "prisma-database";
import { isAlreadyUpdated } from "../../../../utils";

// Helper function to update the proposal status
const updateProposalStatus = async (
  _id: string,
  status: ProposalStatus,
  event: OnchainEvent,
  lastUpdated: { blockNumber: number; transactionIndex: number; logIndex: number } | null,
) => {
  await database.proposal.update({
    where: { id: _id },
    data: {
      status,
      lastUpdated: {
        blockNumber: event.blockNumber,
        transactionIndex: event.transactionIndex || lastUpdated?.transactionIndex || 0,
        logIndex: event.logIndex || lastUpdated?.logIndex || 0,
      },
    },
  });
};

// Helper function to process the change in proposal status
export const processProposalChange = async (
  proposalId: string,
  event: OnchainEvent,
  entityId: string,
  newStatus: ProposalStatus,
) => {
  const proposal = await Proposals().findById(proposalId, entityId);

  if (!proposal) throw new Error("no proposal found");

  if (!isAlreadyUpdated(event, proposal.lastUpdated)) {
    console.log(`Updating proposal ${proposalId} status to ${newStatus}`);
    await updateProposalStatus(proposal.id, newStatus, event, proposal.lastUpdated);
  }
};
