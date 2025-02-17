import { OnchainEvent, EntityTracker } from "prisma-database";
import { decodeEventLog } from "viem";
import { revolutionDaoLogicV1Abi } from "@cobuild/revolution";
import { revolutionDaoTokenContract } from "./utils/daoTokenContract";
import { getRevolutionDAOEntityId } from "@cobuild/libs/web3/viem/utils/revolutionBuilder";
import { processProposalChange } from "../../../nouns-dao/processEvents/proposals";
import { handleVoteCastEvent } from "../../../nouns-dao/processEvents/voteCast";
import getOrCreateProposal from "../../../nouns-dao/processEvents/creators/getOrCreateProposal";
import { getBlockTimestampForIngestion } from "../../../../../utils/blockUtils";
import { EventProcessor, EventProcessorResult } from "../../../../../events/types";
import { createTopic0Switcher } from "../../../../../topicSwitcher";

export const processRevolutionDAOLogicV1Event: EventProcessor = async (
  entity: EntityTracker,
  event: OnchainEvent,
): Promise<EventProcessorResult> => {
  const tokenContractAddress =
    ((entity.details as any)?.tokenContract as string) ||
    (await revolutionDaoTokenContract(
      entity.chainId,
      //tbd maybe we want to pull the actual auction contract from the entity tracker here?
      event.address.toLowerCase() as `0x${string}`,
      entity.id,
    ));

  if (!tokenContractAddress) {
    throw new Error("No token contract address found");
  }

  const entityId = getRevolutionDAOEntityId(entity.chainId, tokenContractAddress as `0x${string}`);

  const RevolutionV1EventsTopics =
    createTopic0Switcher<typeof revolutionDaoLogicV1Abi>(revolutionDaoLogicV1Abi);

  const decodeEventArgs = {
    abi: revolutionDaoLogicV1Abi,
    strict: true,
    data: event.data as `0x${string}`,
    topics: event.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
  } as const;

  switch (event.topics[0]) {
    case RevolutionV1EventsTopics.ProposalCanceled: {
      console.log("proposal cancelled");

      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "ProposalCanceled" });
      await processProposalChange(args.id.toString(), event, entityId, "cancelled");
      break;
    }
    case RevolutionV1EventsTopics.ProposalVetoed: {
      console.log("proposal vetoed");

      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "ProposalVetoed" });

      await processProposalChange(args.id.toString(), event, entityId, "vetoed");
      break;
    }
    case RevolutionV1EventsTopics.ProposalExecuted: {
      console.log("proposal executed");

      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "ProposalExecuted" });

      await processProposalChange(args.id.toString(), event, entityId, "executed");
      break;
    }
    case RevolutionV1EventsTopics.ProposalQueued: {
      console.log("proposal queued");

      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "ProposalQueued" });

      await processProposalChange(args.id.toString(), event, entityId, "queued");
      break;
    }
    case RevolutionV1EventsTopics.VoteCast: {
      console.log("vote cast");

      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "VoteCast" });

      const blockNumber = event.blockNumber;
      const blockTimestamp = await getBlockTimestampForIngestion(entity.chainId, blockNumber);
      await handleVoteCastEvent(
        { ...args, proposalId: args.proposalId.toString() },
        entityId,
        tokenContractAddress,
        event,
        blockTimestamp,
        "revolution",
      );
      break;
    }
    case RevolutionV1EventsTopics.ProposalCreatedWithRequirements: {
      console.log("proposal created with requirements");

      const { args } = decodeEventLog({
        ...decodeEventArgs,
        eventName: "ProposalCreatedWithRequirements",
      });
      const blockTimestamp = await getBlockTimestampForIngestion(entity.chainId, event.blockNumber);
      const proposal = await getOrCreateProposal(
        { ...args, id: args.id.toString() },
        entityId,
        tokenContractAddress,
        "revolution",
        event,
        blockTimestamp,
        entity.trackerType,
      );

      return proposal.proposalId;
    }
  }
};
