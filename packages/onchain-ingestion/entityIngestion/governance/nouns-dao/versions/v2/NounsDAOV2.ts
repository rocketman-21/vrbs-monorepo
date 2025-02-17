import { OnchainEvent, EntityTracker } from "prisma-database";
import { decodeEventLog } from "viem";
import { processProposalChange } from "../../processEvents/proposals";
import { handleVoteCastEvent } from "../../processEvents/voteCast";
import getOrCreateProposal from "../../processEvents/creators/getOrCreateProposal";
import { getBlockTimestampForIngestion } from "../../../../../utils/blockUtils";
import { createTopic0Switcher } from "../../../../../topicSwitcher";
import { nounsDaoLogicV2Abi } from "../../../../../web3/wagmi";
import { EventProcessorResult, EventProcessor } from "../../../../../events/types";
import { generateNounishGovernanceEntityId } from "../entityUtils";
import { nounsDAOLogicTokenContract } from "../../../../../contractValidity/nouns/daoLogicTokenContract";

export const processNounsV2Event: EventProcessor = async (
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

  const NounsV2EventsTopics = createTopic0Switcher<typeof nounsDaoLogicV2Abi>(nounsDaoLogicV2Abi);

  const decodeEventArgs = {
    abi: nounsDaoLogicV2Abi,
    strict: true,
    data: event.data as `0x${string}`,
    topics: event.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
  } as const;

  switch (event.topics[0]) {
    case NounsV2EventsTopics.ProposalCanceled: {
      console.log("proposal cancelled");

      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "ProposalCanceled" });
      await processProposalChange(args.id.toString(), event, entityId, "cancelled");
      break;
    }
    case NounsV2EventsTopics.ProposalVetoed: {
      console.log("proposal vetoed");

      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "ProposalVetoed" });

      await processProposalChange(args.id.toString(), event, entityId, "vetoed");
      break;
    }
    case NounsV2EventsTopics.ProposalExecuted: {
      console.log("proposal executed");

      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "ProposalExecuted" });

      await processProposalChange(args.id.toString(), event, entityId, "executed");
      break;
    }
    case NounsV2EventsTopics.ProposalQueued: {
      console.log("proposal queued");

      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "ProposalQueued" });

      await processProposalChange(args.id.toString(), event, entityId, "queued");
      break;
    }
    case NounsV2EventsTopics.VoteCast: {
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
        "nouns",
      );
      break;
    }

    case NounsV2EventsTopics.ProposalCreatedWithRequirements: {
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
        "nouns",
        event,
        blockTimestamp,
        entity.trackerType,
      );

      return proposal.proposalId;
    }
  }
};
