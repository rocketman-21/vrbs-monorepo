import { OnchainEvent } from "prisma-database";
import { database } from "@cobuild/database";

interface IEventBulkWriteOp {
  q: {
    chainId: number;
    blockNumber: number;
    transactionIndex: number | null;
    logIndex: number | null;
  };
  u: {
    $set: Partial<OnchainEvent>;
  };
  upsert: boolean;
}

export const serializeBigInt = (obj: any): any => {
  const serialized = JSON.parse(
    JSON.stringify(
      obj,
      (_, value) => (typeof value === "bigint" ? value.toString() : value), // convert BigInt to string
    ),
  );
  return serialized;
};

const createEventBulkWriteOp = (event: Omit<OnchainEvent, "id">): IEventBulkWriteOp => {
  // If event.args and event.decoded fields exist and contain BigInt values, serialize them
  const serializedDecoded = event.decoded ? serializeBigInt(event.decoded) : event.decoded;

  // Create a new event object with serialized args and decoded fields
  const serializedEvent: Partial<OnchainEvent> = {
    ...event,
    createdAt: { $date: event.createdAt } as any,
    updatedAt: { $date: event.updatedAt } as any,
    decoded: serializedDecoded,
  };
  //unique key is chainId_1_blockNumber_1_transactionIndex_1_logIndex_1

  return {
    q: {
      chainId: event.chainId,
      blockNumber: event.blockNumber,
      transactionIndex: event.transactionIndex,
      logIndex: event.logIndex,
    },
    u: { $set: serializedEvent },
    upsert: true,
  };
};

const bulkWriteEvents = (ops: IEventBulkWriteOp[]) => {
  if (!ops.length) return;

  return database.$runCommandRaw({
    update: "events",
    updates: ops as any[],
  });
};

export const saveEvents = async (events: Omit<OnchainEvent, "id">[]) => {
  if (!events.length) return 0;

  const result = await bulkWriteEvents(events.map(createEventBulkWriteOp));
  const storedCount = parseInt(`${result?.n}`) || 0;

  console.debug(`Stored ${storedCount} events for ${events[0].transactionHash}`);

  return storedCount;
};
