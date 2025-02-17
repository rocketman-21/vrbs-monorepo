import { database } from "@cobuild/database";
import { deleteCacheResult } from "@cobuild/libs/cache";
import { generateAuctionUniqueId } from "@cobuild/libs/web3/auction/auction-uniqueid";
import { Auction, OnchainEvent } from "prisma-database";

interface IAuctionSettledEvent {
  tokenId: bigint;
  winner: `0x${string}`;
  amount: bigint;
  pointsPaidToCreators?: bigint;
  ethPaidToCreators?: bigint;
}

export const handleAuctionSettled = async (
  args: IAuctionSettledEvent,
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

  let pointsPaidToCreators = null;
  let ethPaidToCreators = null;

  if (args.pointsPaidToCreators) {
    pointsPaidToCreators = args.pointsPaidToCreators.toString();
  }

  if (args.ethPaidToCreators) {
    ethPaidToCreators = args.ethPaidToCreators.toString();
  }

  const winner = args.winner.toLowerCase();

  const auction = await database.auction.update({
    where: { uniqueId },
    data: {
      updatedAt: new Date(),
      pointsPaidToCreators,
      ethPaidToCreators,
      winner,
      winningBid: args.amount.toString(),
      settlementTransactionHash: event.transactionHash,
    },
  });

  await deleteCacheResult(uniqueId);

  return auction;
};
