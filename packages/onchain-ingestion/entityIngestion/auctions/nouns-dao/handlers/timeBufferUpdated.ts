import { database } from "@cobuild/database";

import { OnchainEvent } from "prisma-database";
import { getBlockTimestampForIngestion } from "../../../../utils/blockUtils";

interface IAuctionExtendedEvent {
  timeBuffer: bigint;
}

export const handleTimeBufferUpdated = async (
  args: IAuctionExtendedEvent,
  event: OnchainEvent,
): Promise<void> => {
  const timeBuffer = args.timeBuffer.toString();

  const endTimeGt = await getBlockTimestampForIngestion(event.chainId, event.blockNumber);

  await database.auction.updateMany({
    where: {
      auctionContractAddress: event.address.toLowerCase(),
      chainId: event.chainId,
      details: { is: { endTime: { gte: endTimeGt } } },
    },
    data: { timeBuffer: timeBuffer.toString() },
  });
};
