import { OnchainEvent } from "prisma-database";
import { Abi, Log, decodeEventLog } from "viem";

export const parseLog = async (
  log: Log & { args: any },
  chainId: number,
  eventName: string,
  abi: Abi,
): Promise<Omit<OnchainEvent, "id"> | null> => {
  if (!log.transactionHash) {
    console.error("No transaction hash for log", log);
    return null;
  }

  const { data, topics } = log;

  let decoded: any = null;

  try {
    decoded = decodeEventLog({
      abi,
      data,
      strict: true,
      eventName,
      topics,
    });
  } catch (e) {
    console.error("Error decoding event log", e);
  }

  return {
    address: log.address,
    transactionHash: log.transactionHash,
    topics,
    data,
    ingestedOnDemand: false,
    decoded,
    blockNumber: Number(log.blockNumber),
    createdAt: new Date(), // should ideally be blockTimestamp but eh
    updatedAt: new Date(), // Set to current date; adjust if needed
    chainId,
    logIndex: log.logIndex,
    transactionIndex: log.transactionIndex,
    blockHash: log.blockHash,
    removed: log.removed,
  };
};
