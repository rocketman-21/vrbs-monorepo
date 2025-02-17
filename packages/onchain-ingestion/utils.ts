import { OnchainEvent } from "prisma-database";

export function isAlreadyUpdated(
  event: OnchainEvent,
  lastUpdated: { blockNumber: number; transactionIndex: number; logIndex: number } | null,
) {
  if (!lastUpdated) return false;

  if (lastUpdated.blockNumber < event.blockNumber) return false;
  if (
    lastUpdated.blockNumber == event.blockNumber &&
    event.transactionIndex &&
    lastUpdated.transactionIndex < event.transactionIndex
  )
    return false;
  if (
    lastUpdated.blockNumber == event.blockNumber &&
    lastUpdated.transactionIndex == event.transactionIndex &&
    event.logIndex &&
    lastUpdated.logIndex < event.logIndex
  ) {
    return false;
  }
  return true;
}
