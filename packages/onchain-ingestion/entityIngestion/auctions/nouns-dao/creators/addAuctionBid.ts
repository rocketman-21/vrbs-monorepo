import { database } from "@cobuild/database";
import { generateAuctionUniqueId } from "@cobuild/libs/web3/auction/auction-uniqueid";
import { AuctionBid, OnchainEvent } from "prisma-database";
import { getBlockTimestampForIngestion } from "../../../../utils/blockUtils";

interface IAuctionBidEvent {
  tokenId: bigint;
  sender: `0x${string}`;
  bidder: `0x${string}`;
  value: bigint;
  extended: boolean;
}

export const addAuctionBidEvent = async (
  args: IAuctionBidEvent,
  event: OnchainEvent,
  tokenContract: string,
): Promise<AuctionBid> => {
  const auctionContractAddress = event.address.toLowerCase();
  const auctionUniqueId = generateAuctionUniqueId(
    event.chainId,
    args.tokenId.toString(),
    tokenContract,
    auctionContractAddress,
  );

  const bidCreatedAt = await getBlockTimestampForIngestion(event.chainId, event.blockNumber);
  const bidder = args.bidder.toLowerCase();
  const sender = args.sender.toLowerCase();
  const bidAmount = args.value.toString();
  const { transactionHash } = event;
  const uniqueId = `${auctionUniqueId}-${transactionHash}`;

  const auctionBid = await database.auctionBid.upsert({
    where: {
      uniqueId,
    },
    update: {
      bidAmount,
      bidCreatedAt,
      bidder,
    },
    create: {
      bidAmount,
      chainId: event.chainId,
      auctionContractAddress: auctionContractAddress.toLowerCase(),
      auctionUniqueId,
      sender,
      bidCreatedAt,
      uniqueId,
      bidder,
      transactionHash,
    },
  });

  return auctionBid;
};
