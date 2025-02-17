import "server-only";
import { cache } from "react";
import { database } from "../..";
import { EventTracker, ContractTopic0 } from "prisma-database";

export const NOUNS_BLOCK_FOUNDED = 12985444;
//ingestion can readjust this on the fly if its too high
const DEFAULT_BLOCK_JUMP = 5_000;

const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

export function EventTrackers() {
  return Object.assign(database.eventTracker, {
    getEventTrackerFromTopic,
    getEventTracker,
    getEventTrackers,
    addTotalUpserted,
    getTransferEventTrackers,
    updateLastScannedBlock,
    getAllV2EventTrackers,
    getMinTrackedBlockByTopics,
    getOrCreateEventTrackerFromTopic,
  });
}

const getOrCreateEventTrackerFromTopic = cache(
  async (
    chainId: number,
    topic0: string,
    blockToStartScan: number,
    eventName: string,
    implementationContract: `0x${string}`,
    contract?: `0x${string}`,
  ): Promise<EventTracker | null> => {
    const eventTracker = await getEventTrackerFromTopic(
      chainId,
      topic0,
      implementationContract,
      contract,
    );

    if (eventTracker) {
      return eventTracker;
    }

    const doc = {
      chainId,
      name: eventName,
      topic0: topic0,
      blockJump: DEFAULT_BLOCK_JUMP,
      contract: contract?.toLowerCase() ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      //probably need to fix this eventually
      numTopics: -1,
      startBlock: blockToStartScan,
      disabled: false,
      lastScannedBlock: blockToStartScan,
      totalUpserted: 0,
      implementationContract,
    };

    const newTracker = await database.eventTracker.upsert({
      where: {
        topic0,
        chainId,
        implementationContract,
        OR: [{ contract: { isSet: false } }, { contract: !!contract ? contract : null }],
      },
      create: doc,
      update: doc,
    });
    return newTracker;
  },
);

const getEventTrackerFromTopic = cache(
  async (
    chainId: number,
    topic: string,
    implementationContract: `0x${string}`,
    contract?: `0x${string}`,
  ): Promise<EventTracker | null> => {
    const eventTracker = await database.eventTracker.findFirst({
      where: {
        chainId,
        topic0: topic,
        implementationContract,
        OR: [{ contract: { isSet: false } }, { contract: !!contract ? contract : null }],
      },
    });

    return eventTracker;
  },
);

const getEventTracker = cache(async (id: string): Promise<EventTracker | null> => {
  return database.eventTracker.findUnique({ where: { id, disabled: false } });
});

const getEventTrackers = cache(async (chainId: number): Promise<EventTracker[]> => {
  return database.eventTracker.findMany({ where: { chainId, disabled: false } });
});

const getAllV2EventTrackers = cache(async (): Promise<EventTracker[]> => {
  return database.eventTracker.findMany({ where: { disabled: false } });
});

const addTotalUpserted = cache(async (trackerId: string, upserted: number): Promise<void> => {
  await database.eventTracker.update({
    where: { id: trackerId },
    data: { totalUpserted: { increment: upserted } },
  });
});

const getTransferEventTrackers = cache(async (chainId: number): Promise<EventTracker[]> => {
  return database.eventTracker.findMany({
    where: { chainId, disabled: false, topic0: TRANSFER_TOPIC },
  }); // Assume transferTopic is defined
});

const updateLastScannedBlock = cache(
  async (eventTracker: EventTracker, lastScannedBlock: number): Promise<void> => {
    await database.eventTracker.update({
      where: { id: eventTracker.id },
      data: { lastScannedBlock },
    });
  },
);

const getMinTrackedBlockByTopics = cache(
  async (
    chainId: number,
    topics: ContractTopic0[],
    startBlockForTopic: number = NOUNS_BLOCK_FOUNDED,
  ): Promise<number> => {
    const maxTrackedBlocksForEvents: number[] = [];

    for (const topic of topics) {
      const { topic0, eventName, implementationContract } = topic;
      const eventTracker = await getOrCreateEventTrackerFromTopic(
        chainId,
        topic0,
        startBlockForTopic,
        eventName,
        implementationContract as `0x${string}`,
      );
      if (!eventTracker) {
        throw new Error(`No event tracker found for topic ${topic} and chain ${chainId}`);
      }

      if (!eventTracker.disabled) maxTrackedBlocksForEvents.push(eventTracker.lastScannedBlock);
    }
    return Math.min(...maxTrackedBlocksForEvents);
  },
);

// Assume transferTopic and getMinPendingBlock are defined or imported from elsewhere
