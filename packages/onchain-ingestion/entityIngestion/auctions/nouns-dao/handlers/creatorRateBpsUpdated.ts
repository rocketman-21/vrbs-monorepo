import { database } from "@cobuild/database";

import { OnchainEvent } from "prisma-database";
import { getBlockTimestampForIngestion } from "../../../../utils/blockUtils";

interface EventArgs {
  rateBps: bigint;
}

export async function handleCreatorRateBpsUpdated(args: EventArgs, event: OnchainEvent) {
  const { rateBps } = args;

  const endTimeGt = await getBlockTimestampForIngestion(event.chainId, event.blockNumber);

  return await database.auction.updateMany({
    where: {
      auctionContractAddress: event.address.toLowerCase(),
      chainId: event.chainId,
      details: { is: { endTime: { gte: endTimeGt } } },
    },
    data: { creatorRateBps: Number(rateBps) },
  });
}
