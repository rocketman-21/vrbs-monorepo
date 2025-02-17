import { database } from "@cobuild/database";
import { OnchainEvent } from "prisma-database";
import { BlockRange } from "./blockUtils";

export const fetchEvents = async (
  chainId: number,
  blockRange: BlockRange,
  contracts?: string[],
  topic0s?: string[],
): Promise<OnchainEvent[]> => {
  if (!contracts?.length && !topic0s?.length) {
    throw new Error("No addresses or topics provided to fetch events");
  }
  console.log(
    `Fetching events for ${(contracts || topic0s || []).join(", ")} with block range ${
      blockRange.start
    } - ${blockRange.end}`,
  );

  const $match = {
    chainId,
    ...(contracts?.length ? { address: { $in: contracts } } : {}),
    ...(topic0s?.length ? { "topics.0": { $in: topic0s } } : {}),
    blockNumber: { $gte: blockRange.start, $lte: blockRange.end },
  };
  // console.log({ $match: JSON.stringify($match) });

  const eventsRaw = await database.onchainEvent.aggregateRaw({
    pipeline: [
      {
        $match,
      },
      { $sort: { blockNumber: 1 } },
    ],
  });

  (eventsRaw as any).forEach((event: any) => {
    event.createdAt = event.createdAt?.$date ? new Date(event.createdAt.$date) : event.createdAt;
    event.updatedAt = event.updatedAt?.$date ? new Date(event.updatedAt.$date) : event.updatedAt;
  });

  const events: OnchainEvent[] = eventsRaw as any as OnchainEvent[];
  console.log(
    `Got ${events.length} events for ${(contracts || topic0s || []).join(
      ", ",
    )} and chainId ${chainId}`,
  );

  //sort by block number, transaction index, log index
  return sortOnchainEvents(events);
};

//function to sort events
export function sortOnchainEvents(events: OnchainEvent[]) {
  return events.sort((a, b) => {
    if (a.blockNumber !== b.blockNumber) {
      return a.blockNumber - b.blockNumber;
    }
    if (a.transactionIndex && b.transactionIndex && a.transactionIndex !== b.transactionIndex) {
      return a.transactionIndex - b.transactionIndex;
    }
    // return a.logIndex - b.logIndex;
    if (a.logIndex && b.logIndex) {
      return a.logIndex - b.logIndex;
    }
    return 0;
  });
}
