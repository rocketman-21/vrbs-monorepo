import { Blocks } from "@cobuild/database/models/eth/Blocks";
import { EntityTracker } from "prisma-database";
import { calculateBlockRange } from "./utils/blockUtils";
import { fetchEvents } from "./utils/eventUtils";
import { EntityTrackers } from "@cobuild/database/models/eth/EntityTrackers";
import { EventProcessor } from "./events/types";

export const processEntityTracker = async (
  entity: EntityTracker,
  earliestTrackedTopicBlock: number,
  eventProcessor: EventProcessor,
): Promise<void> => {
  const { chainId, contractTopic0s, blockJump, contracts } = entity;
  let { lastScannedBlock } = entity;
  const mostRecentBlock = await Blocks().getLatestBlockNumber(chainId || 1);
  let { end, start } = await calculateBlockRange(
    lastScannedBlock + 1,
    earliestTrackedTopicBlock,
    chainId,
  );

  //working on this entity until we are caught up
  console.log(
    `Working on ${entity.id} until we are caught up, last scanned block: ${lastScannedBlock}, most recent block: ${mostRecentBlock}, start: ${start}, end: ${end}`,
  );

  while ((mostRecentBlock || 0) > lastScannedBlock && lastScannedBlock !== end) {
    //inform system that we are working on this entity
    await EntityTrackers().updateLastPickedUpWorkOn(entity.id, new Date());

    if (start > end) {
      console.log("caught up");
      return;
    }

    console.log("working on", start, end);

    let events = await fetchEvents(
      chainId,
      {
        end,
        start,
      },
      contracts.map(({ address }) => address),
      contractTopic0s.map(({ topic0 }) => topic0),
    );

    for (let event of events) {
      if (!event.data) {
        console.error(`No data for event ${event.id}`);
        continue;
      }
      await eventProcessor(entity, event);
    }

    //update entity.details.lastScannedBlock to end block
    console.log(`Updating last scanned block to ${end}, for most recent: ${mostRecentBlock}`);
    await EntityTrackers().updateLastScannedBlock(entity.id, end);
    lastScannedBlock = end;

    const blockRange = await calculateBlockRange(
      lastScannedBlock + 1,
      earliestTrackedTopicBlock,
      chainId,
      blockJump,
    );
    end = blockRange.end;
    start = blockRange.start;
  }
};
