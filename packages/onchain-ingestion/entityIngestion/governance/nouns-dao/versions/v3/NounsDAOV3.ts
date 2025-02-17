import { OnchainEvent, EntityTracker } from "prisma-database";
import { decodeEventLog } from "viem";

import {
  updateProposalDescription,
  updateProposalTransactions,
  updateProposalDescriptionAndTransactions,
} from "../../processEvents/updaters/updateProposals";
import { processProposalChange } from "../../processEvents/proposals";
import { handleVoteCastEvent } from "../../processEvents/voteCast";
import getOrCreateProposal from "../../processEvents/creators/getOrCreateProposal";
import { EventProcessorResult, EventProcessor } from "../../../../../events/types";
import { createTopic0Switcher } from "../../../../../topicSwitcher";
import { nounsDaoLogicV3Abi } from "../../../../../web3/wagmi";
import { getBlockTimestampForIngestion } from "../../../../../utils/blockUtils";
import { nounsDAOLogicTokenContract } from "../../../../../contractValidity/nouns/daoLogicTokenContract";
import { generateNounishGovernanceEntityId } from "../entityUtils";

export const processNounsV3Event: EventProcessor = async (
  entity: EntityTracker,
  event: OnchainEvent,
): Promise<EventProcessorResult> => {
  const tokenContractAddress =
    ((entity.details as any)?.tokenContract as `0x${string}`) ||
    (await nounsDAOLogicTokenContract(
      entity.chainId,
      event.address.toLowerCase() as `0x${string}`,
      entity.id,
    ));

  if (!tokenContractAddress) {
    throw new Error("No token contract address found");
  }

  const entityId = generateNounishGovernanceEntityId(entity.chainId, tokenContractAddress);

  const NounsV3EventsTopics = createTopic0Switcher<typeof nounsDaoLogicV3Abi>(nounsDaoLogicV3Abi);

  const decodeEventArgs = {
    abi: nounsDaoLogicV3Abi,
    strict: true,
    data: event.data as `0x${string}`,
    topics: event.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
  } as const;

  switch (event.topics[0]) {
    case NounsV3EventsTopics.ProposalCanceled: {
      console.log("proposal cancelled");

      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "ProposalCanceled" });

      await processProposalChange(args.id.toString(), event, entityId, "cancelled");
      break;
    }
    case NounsV3EventsTopics.ProposalVetoed: {
      console.log("proposal vetoed");

      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "ProposalVetoed" });
      await processProposalChange(args.id.toString(), event, entityId, "vetoed");
      break;
    }
    case NounsV3EventsTopics.ProposalExecuted: {
      console.log("proposal executed");

      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "ProposalExecuted" });
      await processProposalChange(args.id.toString(), event, entityId, "executed");
      break;
    }
    case NounsV3EventsTopics.ProposalQueued: {
      console.log("proposal queued");

      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "ProposalQueued" });

      await processProposalChange(args.id.toString(), event, entityId, "queued");
      break;
    }
    case NounsV3EventsTopics.VoteCast: {
      console.log("vote cast");

      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "VoteCast" });

      const blockTimestamp = await getBlockTimestampForIngestion(entity.chainId, event.blockNumber);
      await handleVoteCastEvent(
        { ...args, proposalId: args.proposalId.toString() },
        entityId,
        tokenContractAddress,
        event,
        blockTimestamp,
        "nouns",
      );
      break;
    }
    case NounsV3EventsTopics.ProposalCreatedWithRequirements: {
      console.log("proposal created with requirements");

      const { args } = decodeEventLog({
        ...decodeEventArgs,
        eventName: "ProposalCreatedWithRequirements",
      });

      const blockNumber = event.blockNumber;
      const blockTimestamp = await getBlockTimestampForIngestion(entity.chainId, blockNumber);

      const proposal = await getOrCreateProposal(
        { ...args, id: args.id.toString() },
        entityId,
        tokenContractAddress,
        "nouns",
        event,
        blockTimestamp,
        entity.trackerType,
      );

      return proposal.proposalId;
    }
    case NounsV3EventsTopics.ProposalDescriptionUpdated: {
      console.log("proposal description updated");
      const { args } = decodeEventLog({
        ...decodeEventArgs,
        eventName: "ProposalDescriptionUpdated",
      });

      await updateProposalDescription(args.id.toString(), args.description, entityId, event);
      break;
    }
    case NounsV3EventsTopics.ProposalTransactionsUpdated: {
      console.log("proposal transactions updated");
      const { args } = decodeEventLog({
        ...decodeEventArgs,
        eventName: "ProposalTransactionsUpdated",
      });

      await updateProposalTransactions(args, entityId, event);
      break;
    }
    case NounsV3EventsTopics.ProposalUpdated: {
      console.log("proposal updated");
      const { args } = decodeEventLog({
        ...decodeEventArgs,
        eventName: "ProposalUpdated",
      });

      await updateProposalDescriptionAndTransactions(args, entityId, event);
      break;
    }
  }
};
