import { database } from "@cobuild/database";

import { OnchainEvent } from "prisma-database";
import { getBlockTimestampForIngestion } from "../../../../utils/blockUtils";

interface IAuctionMinBidUpdatedEvent {
  minBidIncrementPercentage: bigint;
}

export const handleMinBidUpdated = async (
  args: IAuctionMinBidUpdatedEvent,
  event: OnchainEvent,
): Promise<void> => {
  const minBidIncrementPercentage = args.minBidIncrementPercentage.toString();

  const endTimeGt = await getBlockTimestampForIngestion(event.chainId, event.blockNumber);

  await database.auction.updateMany({
    where: {
      auctionContractAddress: event.address.toLowerCase(),
      chainId: event.chainId,
      details: { is: { endTime: { gte: endTimeGt } } },
    },
    data: { minBidIncrementPercentage: minBidIncrementPercentage.toString() },
  });
};
