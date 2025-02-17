import { OnchainEvent, EntityTracker } from "prisma-database";
import { decodeEventLog } from "viem";
import { processProposalChange } from "../../../processEvents/proposals";
import { handleVoteCastEvent } from "../../../processEvents/voteCast";
import getOrCreateProposal from "../../../processEvents/creators/getOrCreateProposal";
import { createTopic0Switcher } from "../../../../../../topicSwitcher";
import { nounsBuilderGovernorV1Abi } from "../../../../../../web3/wagmi";
import { EventProcessorResult } from "../../../../../../events/types";
import { getBlockTimestampForIngestion } from "../../../../../../utils/blockUtils";
import { builderDAOGovernorTokenContract } from "../../../../../../contractValidity/nouns/daoLogicTokenContract";
import { generateNounsBuilderGovernanceEntityId } from "../../entityUtils";

export const processBuilderGovernorV1Event = async (
  entity: EntityTracker,
  event: OnchainEvent,
): Promise<EventProcessorResult> => {
  const tokenContractAddress =
    ((entity.details as any)?.tokenContract as `0x${string}`) ||
    (await builderDAOGovernorTokenContract(
      entity.chainId,
      event.address.toLowerCase() as `0x${string}`,
      entity.id,
    ));

  if (!tokenContractAddress) {
    throw new Error("No token contract address found");
  }

  const entityId = generateNounsBuilderGovernanceEntityId(entity.chainId, tokenContractAddress);

  const GovernorEventsTopics =
    createTopic0Switcher<typeof nounsBuilderGovernorV1Abi>(nounsBuilderGovernorV1Abi);

  const decodeEventArgs = {
    abi: nounsBuilderGovernorV1Abi,
    strict: true,
    data: event.data as `0x${string}`,
    topics: event.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
  } as const;

  switch (event.topics[0]) {
    case GovernorEventsTopics.ProposalCanceled: {
      console.log("proposal cancelled");
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "ProposalCanceled" });

      await processProposalChange(args.proposalId, event, entityId, "cancelled");
      break;
    }
    case GovernorEventsTopics.ProposalVetoed: {
      console.log("proposal vetoed");

      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "ProposalVetoed" });

      await processProposalChange(args.proposalId, event, entityId, "vetoed");
      break;
    }
    case GovernorEventsTopics.ProposalExecuted: {
      console.log("proposal executed");

      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "ProposalExecuted" });
      await processProposalChange(args.proposalId, event, entityId, "executed");
      break;
    }
    case GovernorEventsTopics.ProposalQueued: {
      console.log("proposal queued");

      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "ProposalQueued" });
      await processProposalChange(args.proposalId, event, entityId, "queued");
      break;
    }
    case GovernorEventsTopics.VoteCast: {
      console.log("vote cast");

      const decoded = decodeEventLog({ ...decodeEventArgs, eventName: "VoteCast" });
      const { args } = decoded;
      const blockNumber = event.blockNumber;
      const blockTimestamp = await getBlockTimestampForIngestion(entity.chainId, blockNumber);
      await handleVoteCastEvent(
        { ...args, votes: args.weight, support: Number(args.support) },
        entityId,
        tokenContractAddress,
        event,
        blockTimestamp,
        "nounsbuilder",
      );
      break;
    }
    case GovernorEventsTopics.ProposalCreated: {
      console.log("proposal created with requirements");

      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "ProposalCreated" });
      const { proposal } = args;

      const blockTimestamp = await getBlockTimestampForIngestion(entity.chainId, event.blockNumber);
      const generatedProposal = await getOrCreateProposal(
        {
          ...args,
          ...proposal,
          id: args.proposalId,
          startTimestamp: proposal.voteStart * 1000,
          endTimestamp: proposal.voteEnd * 1000,
          proposalThreshold: BigInt(proposal.proposalThreshold),
          signatures: [],
        },
        entityId,
        tokenContractAddress,
        "nounsbuilder",
        event,
        blockTimestamp,
        entity.trackerType,
      );

      return generatedProposal.proposalId;
    }
  }
};
