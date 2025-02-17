import { EventTrackers } from "@cobuild/database/models/eth/EventTrackers";
import { TrackerType } from "prisma-database";
import { EntityTrackers } from "@cobuild/database/models/eth/EntityTrackers";
import { processEntityTracker } from "../processEntityTracker";
import { getEventProcessorByTrackerType } from "../utils/getEventProcessor";
import { EventProcessor } from "../events/types";

export const ingestEntityByType = async (
  trackerType: TrackerType,
  contractAddress?: `0x${string}`,
): Promise<void> => {
  const entities = await EntityTrackers().getTrackersByTypeForIngestion(
    trackerType,
    contractAddress,
  );

  for (let entity of entities) {
    const { chainId, contractTopic0s, startBlock } = entity;
    //get last block to know how far to go back searching for events
    let earliestTrackedTopicBlock = await EventTrackers().getMinTrackedBlockByTopics(
      chainId,
      contractTopic0s,
      startBlock,
    );

    if (entity.disabled) {
      console.log(`entity is disabled ${entity.id}`);
      continue;
    }

    console.log({ entity, earliestTrackedTopicBlock });

    const eventProcessor: EventProcessor = getEventProcessorByTrackerType(trackerType);

    await processEntityTracker(entity, earliestTrackedTopicBlock, eventProcessor);
  }
};
