import { Auctions } from "@cobuild/database/models/revolution/auctions/Auctions";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { deleteCacheResult } from "@cobuild/libs/cache";
import { getCurrentAuction } from "@cobuild/libs/web3/auction/current-auction";
import pick from "lodash/pick";
import { notFound } from "next/navigation";
import { cache } from "react";

export const getAuction = cache(async (revolutionId: string, tokenId: string) => {
  const revolution = await Revolutions().getById(revolutionId);

  if (!revolution) return notFound();

  const { chainId, addresses, descriptor } = revolution;

  if (!addresses || !descriptor || !revolution.auction || !addresses.auction || !addresses.token) {
    notFound();
  }

  const tokenName = descriptor.tokenNamePrefix;

  const currentAuction = await getCurrentAuction(addresses.auction, revolution.chainId);
  if (!currentAuction) notFound();

  const currentTokenId = currentAuction.tokenId;
  const isCurrent = tokenId === currentTokenId;

  if (isCurrent) {
    return {
      ...pick(currentAuction, ["chainId", "hasBeenLaunched", "wasBurned", "isOver"]),
      isCurrent,
      currentTokenId,
      details: {
        endTime: new Date(currentAuction.endTime * 1000),
        startTime: new Date(currentAuction.startTime * 1000),
        highestBidder: currentAuction.bidder,
      },
      highestBidder: currentAuction.bidder as `0x${string}`,
      highestBid: currentAuction.amount,
      winner: null,
      winningBid: currentAuction.amount,
      auctionContractAddress: currentAuction.contractAddress,
      nftContractAddress: addresses.token,
      creatorRateBps: revolution.auction.creatorRateBPS,
      ethPaidToCreators: BigInt(0),
      pointsPaidToCreators: BigInt(0),
      entropyRateBps: revolution.auction.entropyRateBPS,
      tokenName,
      acceptanceManifestoSpeech: null,
    };
  }

  const auction = await Auctions().getByTokenId(
    chainId,
    tokenId,
    addresses.token,
    addresses.auction,
  );

  if (!auction) notFound();

  if (!auction.settlementTransactionHash) {
    // Auction is over, but not ingested yet - we don't want to store stale data in cache
    await deleteCacheResult(auction.uniqueId);
  }

  return {
    ...auction,
    isCurrent,
    currentTokenId,
    highestBidder: auction.winner as `0x${string}`,
    highestBid: auction.winningBid,
    tokenName,
    pointsPaidToCreators: BigInt(auction.pointsPaidToCreators || "0"),
    ethPaidToCreators: BigInt(auction.ethPaidToCreators || "0"),
  };
});
