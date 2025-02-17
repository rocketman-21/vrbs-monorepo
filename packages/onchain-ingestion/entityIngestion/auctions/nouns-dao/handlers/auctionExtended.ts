import { database } from "@cobuild/database";
import { deleteCacheResult } from "@cobuild/libs/cache";
import { generateAuctionUniqueId } from "@cobuild/libs/web3/auction/auction-uniqueid";
import { Auction, OnchainEvent } from "prisma-database";

interface IAuctionExtendedEvent {
  tokenId: bigint;
  endTime: bigint;
}

export const handleAuctionExtended = async (
  args: IAuctionExtendedEvent,
  event: OnchainEvent,
  tokenContract: string,
): Promise<Auction> => {
  const auctionContractAddress = event.address.toLowerCase();

  const uniqueId = generateAuctionUniqueId(
    event.chainId,
    args.tokenId.toString(),
    tokenContract,
    auctionContractAddress,
  );

  const endTime = new Date(Number(args.endTime) * 1000);

  const auction = await database.auction.update({
    where: { uniqueId },
    data: {
      updatedAt: new Date(),
      details: { update: { endTime } },
    },
  });

  await deleteCacheResult(uniqueId);

  return auction;
};
