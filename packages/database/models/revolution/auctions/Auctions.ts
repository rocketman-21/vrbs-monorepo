import "server-only";

import { cacheResult } from "@cobuild/libs/cache";
import { getArtPieceById } from "@cobuild/libs/web3/auction/auction-piece";
import { generateAuctionUniqueId } from "@cobuild/libs/web3/auction/auction-uniqueid";
import { getCurrentAuction } from "@cobuild/libs/web3/auction/current-auction";
import { getGovernanceTokenQuote } from "@cobuild/libs/web3/auction/governance-token";
import { getAuctionTokenMetadata } from "@cobuild/libs/web3/auction/token-metadata";
import { unstable_cache } from "next/cache";
import { AuctionBid } from "prisma-database";
import { cache } from "react";
import { database } from "../../..";
import { generateOnchainPieceSubmissionSlug } from "../submissions/set/createCreation";
import { transformAuction } from "./Auction";

export function Auctions() {
  return {
    getByTokenId, // Use only for old auctions
    getBidHistory,
    countUniqueWinners,
    getTotalAuctionVolume,
    countUniqueBidders,
    getFinalizedAuctionsForContract,
    getTotalPaidToCreators,
    getSubmission,
  };
}

const getByTokenId = async (
  chainId: number,
  nftTokenId: string,
  tokenContract: string,
  auctionContract: string,
) => {
  return cacheResult(
    generateAuctionUniqueId(chainId, nftTokenId, tokenContract, auctionContract),
    300,
    async () => {
      const auction = await database.auction.findFirst({
        where: {
          auctionContractAddress: auctionContract.toLowerCase(),
          chainId,
          nftTokenId,
        },
      });

      return auction ? transformAuction(auction) : null;
    },
  );
};

const getBidHistory = async (
  auctionContractAddress: `0x${string}`,
  tokenContractAddress: `0x${string}`,
  chainId: number,
  nftTokenId: string,
): Promise<AuctionBid[]> => {
  const auctionUniqueId = generateAuctionUniqueId(
    chainId,
    nftTokenId,
    tokenContractAddress,
    auctionContractAddress,
  );

  return await database.auctionBid.findMany({
    where: { auctionUniqueId },
    orderBy: { bidCreatedAt: "desc" },
  });
};

const countUniqueBidders = cache(
  async (auctionContractAddress: string, chainId: number): Promise<number | null> => {
    return cacheResult(
      `auction_uniqueBidders_${auctionContractAddress}_${chainId}`,
      120,
      async () => {
        const biddersRaw = await database.auctionBid.aggregateRaw({
          pipeline: [
            {
              $match: {
                chainId,
                auctionContractAddress: auctionContractAddress.toLowerCase(),
              },
            },
            {
              // group by winner field
              $group: { _id: "$bidder" },
            },
            { $project: { _id: 1 } },
          ],
        });

        // return count of unique winners
        return (biddersRaw?.length || 0) as number;
      },
    );
  },
);

const getFinalizedAuctionsForContract = async (
  auctionContractAddress: `0x${string}`,
  tokenContractAddress: `0x${string}`,
  chainId: number,
  limit: number,
) => {
  const auctions = await database.auction.findMany({
    where: {
      chainId,
      auctionContractAddress: auctionContractAddress.toLowerCase(),
      winner: { not: null },
    },
    include: { winnerProfile: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  const tokenMetadata = await Promise.all(
    auctions.map(a => getAuctionTokenMetadata(tokenContractAddress, chainId, a.nftTokenId)),
  );

  // merge and return
  return auctions.map((a, i) => {
    return {
      ...a,
      tokenMetadata: tokenMetadata[i],
    };
  });
};

const getTotalAuctionVolume = async (
  auctionContractAddress: string,
  chainId: number,
): Promise<number | null> => {
  return cacheResult(
    `auction_totalAuctionVolume_${auctionContractAddress}_${chainId}`,
    120,
    async () => {
      const totalBidVolumeRaw = (await database.auction.aggregateRaw({
        pipeline: [
          {
            $match: {
              chainId,
              auctionContractAddress: auctionContractAddress.toLowerCase(),
              winningBid: { $ne: null },
            },
          },
          { $addFields: { bidAmount: { $toDouble: "$winningBid" } } },
          {
            // sum bidAmount field, convert to number first
            $group: { _id: null, totalBidVolume: { $sum: "$bidAmount" } },
          },
          { $project: { _id: 0, totalBidVolume: 1 } },
        ],
      })) as unknown as { _id: null; totalBidVolume: number }[];

      // return count of unique winners
      return ((totalBidVolumeRaw?.[0]?.totalBidVolume || 0) / 1e18) as number;
    },
  );
};

const countUniqueWinners = cache(
  async (auctionContractAddress: string, chainId: number): Promise<number | null> => {
    return cacheResult(
      `auction_uniqueWinners_${auctionContractAddress}_${chainId}`,
      120,
      async () => {
        const winnersRaw = await database.auction.aggregateRaw({
          pipeline: [
            {
              $match: {
                chainId,
                auctionContractAddress: auctionContractAddress.toLowerCase(),
                winner: { $ne: null },
              },
            },
            {
              // group by winner field
              $group: { _id: "$winner" },
            },
            { $project: { _id: 1 } },
          ],
        });

        // return count of unique winners
        return (winnersRaw?.length || 0) as number;
      },
    );
  },
);

const getTotalPaidToCreators = cache(
  async (
    auctionContractAddress: string,
    pointsEmitter: string,
    chainId: number,
    creatorPayment: { etherBPS: number; pointsBPS: number },
  ): Promise<{ points: number; eth: number } | null> => {
    return cacheResult(
      `auction_totalPaidToCreators_${auctionContractAddress}_${chainId}`,
      120,
      async () => {
        const [totalPaidToCreatorsRaw, currentAuction] = await Promise.all([
          (await database.auction.aggregateRaw({
            pipeline: [
              {
                $match: {
                  chainId,
                  auctionContractAddress: auctionContractAddress.toLowerCase(),
                  winner: { $ne: null },
                },
              },
              //convert fields to float first
              { $addFields: { pointsPaidToCreators: { $toDouble: "$pointsPaidToCreators" } } },
              { $addFields: { ethPaidToCreators: { $toDouble: "$ethPaidToCreators" } } },
              {
                $group: {
                  _id: null,
                  pointsPaidToCreators: { $sum: "$pointsPaidToCreators" },
                  ethPaidToCreators: { $sum: "$ethPaidToCreators" },
                },
              },
              { $project: { _id: 0, pointsPaidToCreators: 1, ethPaidToCreators: 1 } },
            ],
          })) as unknown as {
            _id: null;
            pointsPaidToCreators: number;
            ethPaidToCreators: number;
          }[],
          getCurrentAuction(auctionContractAddress as `0x${string}`, chainId),
        ]);

        const currentAuctionEther = (currentAuction.amount * creatorPayment.etherBPS) / 1e18 / 1e4;

        const currentAuctionPointsPayment =
          (currentAuction.amount * creatorPayment.pointsBPS) / 1e4;

        const quote = await getGovernanceTokenQuote(
          pointsEmitter,
          chainId,
          currentAuctionPointsPayment,
        );

        const points =
          (totalPaidToCreatorsRaw?.[0]?.pointsPaidToCreators || 0) + Number(quote) || 0;
        const eth =
          (totalPaidToCreatorsRaw?.[0]?.ethPaidToCreators / 1e18 || 0) + currentAuctionEther || 0;

        return { points, eth };
      },
    );
  },
);

const getSubmission = unstable_cache(
  async (
    tokenContract: `0x${string}`,
    cultureIndex: `0x${string}`,
    chainId: number,
    tokenId: string,
  ) => {
    const pieceId = await getArtPieceById(tokenContract, chainId, tokenId);
    if (!pieceId) return null;

    const slug = generateOnchainPieceSubmissionSlug(chainId, cultureIndex, pieceId);
    return await database.submission.findFirst({ where: { slug } });
  },
  undefined,
  { revalidate: 1200, tags: ["auction"] },
);
