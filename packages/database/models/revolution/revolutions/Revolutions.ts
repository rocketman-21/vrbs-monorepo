import "server-only";

import { cacheResult } from "@cobuild/libs/cache";
import { unstable_cache } from "next/cache";
import { Revolution } from "prisma-database";
import { cache } from "react";
import { database } from "../../..";
import { Proposals } from "../../governance/Proposals";
import { Drafts } from "../../social/Drafts";
import { IProfile } from "../../social/IProfile";
import { Ideas } from "../../social/Ideas";
import { transformProfile } from "../../social/Profile";
import { Auctions } from "../auctions/Auctions";
import { Grants } from "../grants/Grants";
import { Submissions } from "../submissions/Submissions";
import { IRevolution } from "./IRevolution";
import { transformRevolution } from "./Revolution";

export function Revolutions() {
  return {
    getById,
    getRelated,
    getParentRevolution,
    getAllOnchainRevolutions,
    getTotalMembers,
    getMoneyRaised,
    getUniqueIdeaCounts,
    getTotalFunded,
    fundingTransactions,
  };
}

const getAllOnchainRevolutions = cache(async () => {
  const revolutions = await database.revolution.findMany({
    where: { tokenContract: { isSet: true } },
  });

  return await Promise.all(revolutions.map(transformRevolution));
});

const getById = cache(async (revolutionId: string): Promise<IRevolution | null> => {
  return cacheResult(`revolution_getById_${revolutionId}`, 120, async () => {
    const rev = await database.revolution.findFirst({ where: { revolutionId } });
    return rev ? transformRevolution(rev) : null;
  });
});

// Either get child or parent's children
const getRelated = unstable_cache(
  async (revolution: Revolution) => {
    const related: IRevolution[] = [];

    // For parent revolutions = get children
    const children = await getChildRevolutions(revolution.revolutionId);
    if (children.length > 0) {
      related.push(...children);
    }

    // For child revolutions = get siblings + parent
    if (related.length === 0 && revolution.scope?.id) {
      const [parent, siblings] = await Promise.all([
        getById(revolution.scope.id),
        getSiblingRevolutions(revolution.scope.id),
      ]);

      if (parent) related.push(parent);
      related.push(...siblings.filter(s => s.revolutionId !== revolution.revolutionId));
    }

    return related.map(r => ({
      name: r.name,
      revolutionId: r.revolutionId,
      logo: r.logo,
      coverImage: r.coverImage,
      homepageRedirect: r.config.homepageRedirect,
    }));
  },
  undefined,
  { revalidate: 1200, tags: ["revolutions"] },
);

const getChildRevolutions = cache(async (revolutionId: string) => {
  const revolutions = await database.revolution.findMany({
    where: { scope: { is: { id: revolutionId } } },
    orderBy: { createdAt: "asc" },
    // cacheStrategy: { ttl: 600, swr: 60 },
  });

  return await Promise.all(revolutions.map(transformRevolution));
});

const getSiblingRevolutions = cache(async (revolutionId: string) => {
  const revolutions = await database.revolution.findMany({
    where: { scope: { is: { id: revolutionId } } },
    orderBy: { createdAt: "asc" },
    // cacheStrategy: { ttl: 600, swr: 60 },
  });

  return await Promise.all(revolutions.map(transformRevolution));
});

const getParentRevolution = cache(async (revolutionId: string) => {
  const revolution = await getById(revolutionId);

  //for child revolutions like hubinclusivo - return nounsesports parent revolutionId they are scoped to
  //otherwise return current id
  return revolution?.scope?.id || revolutionId;
});

export function isParentRevolution(revolution: Revolution) {
  return !revolution.scope?.id || revolution.revolutionId === "skateboardingcares";
}

const getNumHolders = cache(
  async (pointsAddress: string, chainId: number): Promise<number | null> => {
    return cacheResult(`points_totalHolders_${pointsAddress}_${chainId}`, 360, async () => {
      const totalHolders = await database.onchainEvent.aggregateRaw({
        pipeline: [
          {
            $match: {
              chainId,
              address: pointsAddress.toLowerCase(),
              "topics.0": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            },
          },
          {
            $group: { _id: "$decoded.args.to" },
          },
          { $project: { _id: 1 } },
        ],
      });

      // return count of unique winners
      return (totalHolders?.length || 0) as number;
    });
  },
);

const getTotalMembers = cache(
  async (
    revolutionId: string,
  ): Promise<{
    tokenHolders: number;
    auctionWinners: number;
    total: number;
    uniqueBidders: number;
    uniqueCreators: number;
  }> => {
    return cacheResult(`rev_getTotalMembers_${revolutionId}`, 120, async () => {
      const rev = await getById(revolutionId);

      let uniqueAuctionWinners = 0;
      let uniqueAuctionBidders = 0;
      let uniqueTokenHolders = 0;
      let uniqueCreators = 0;

      if (rev?.addresses?.auction) {
        uniqueAuctionWinners =
          (await Auctions().countUniqueWinners(rev.addresses.auction, rev.chainId)) || 0;
        uniqueAuctionBidders =
          (await Auctions().countUniqueBidders(rev.addresses.auction, rev.chainId)) || 0;
      }

      if (rev?.addresses?.cultureIndex) {
        uniqueCreators =
          (await Submissions().countUniqueCreators(rev.addresses.cultureIndex, rev.chainId)) || 0;
      }

      if (rev?.addresses?.points) {
        uniqueTokenHolders = (await getNumHolders(rev.addresses.points, rev.chainId)) || 0;
      }

      return {
        tokenHolders: uniqueTokenHolders,
        auctionWinners: uniqueAuctionWinners,
        total: uniqueTokenHolders + uniqueAuctionWinners + uniqueAuctionBidders + uniqueCreators,
        uniqueBidders: uniqueAuctionBidders,
        uniqueCreators,
      };
    });
  },
);

const getPointsVolume = cache(
  async (
    emitterAddress: string,
    chainId: number,
    auctionContractAddress: string,
  ): Promise<number | null> => {
    return cacheResult(`points_pointsVolume_${emitterAddress}_${chainId}`, 360, async () => {
      const pointsVolume = (await database.pointsPurchase.aggregateRaw({
        pipeline: [
          {
            $match: {
              chainId,
              address: emitterAddress.toLowerCase(),
              buyer: { $ne: auctionContractAddress.toLowerCase() },
            },
          },
          { $addFields: { payment: { $toDouble: "$payment" } } },
          {
            // sum payment field, convert to number first
            $group: { _id: null, totalPayment: { $sum: "$payment" } },
          },
          { $project: { _id: 0, totalPayment: 1 } },
        ],
      })) as unknown as { _id: null; totalPayment: number }[];

      // return count of unique winners
      return ((pointsVolume?.[0]?.totalPayment || 0) / 1e18) as number;
    });
  },
);

const getUniqueIdeaCounts = cache(
  async (
    revolutionId: string,
  ): Promise<{
    ideas: number;
    total: number;
    proposals: number;
    grants: number;
  }> => {
    return cacheResult(`rev_getUniqueIdeaCounts_${revolutionId}`, 120, async () => {
      const rev = await getById(revolutionId);

      let ideas = 0;
      let proposals = 0;
      let grants = 0;
      let drafts = 0;

      if (rev) {
        ideas = await Ideas().countForRevolution(rev.revolutionId);
        grants = await Grants().countForRevolution(rev.revolutionId);
        proposals = await Proposals().countForEntityId(rev.governanceEntityId);
        drafts = await Drafts().countForRevolution(rev.revolutionId);
      }

      return {
        ideas,
        proposals,
        grants,
        drafts,
        total: ideas + proposals + grants + drafts,
      };
    });
  },
);

const getMoneyRaised = cache(
  async (
    revolutionId: string,
  ): Promise<{
    auction: number;
    total: number;
    points: number;
  }> => {
    return cacheResult(`rev_getMoneyRaised_${revolutionId}`, 120, async () => {
      const rev = await getById(revolutionId);

      let auction = 0;
      let points = 0;

      if (rev?.addresses?.auction) {
        auction = (await Auctions().getTotalAuctionVolume(rev.addresses.auction, rev.chainId)) || 0;
      }

      if (rev?.addresses?.pointsEmitter && rev.addresses.auction) {
        points =
          (await getPointsVolume(
            rev.addresses.pointsEmitter,
            rev.chainId,
            rev.addresses.auction,
          )) || 0;
      }

      return {
        auction,
        total: auction + points,
        points,
      };
    });
  },
);

const getTotalFunded = cache(
  async (
    revolutionId: string,
  ): Promise<{
    grants: number;
    total: number;
    dao: number;
  }> => {
    return cacheResult(`rev_getTotalFunded_${revolutionId}`, 120, async () => {
      const rev = await getById(revolutionId);

      let grants = 0;
      let dao = 0;

      if (rev?.addresses?.executor) {
        dao = await Proposals().getTotalFundedAmountEth(rev.governanceEntityId);
      }

      return {
        grants,
        total: grants + dao,
        dao,
      };
    });
  },
);

interface IFundingTransaction {
  transactionHash: string;
  date: Date;
  buyer: string;
  chainId: number;
  amount: string;
  toGrants: string;
  toDao: string;
  purchase: {
    points: string | null;
    auctionItem: { name: string; imageUrl: string; tokenId: string } | null;
  };
  profile?: IProfile;
}

const fundingTransactions = unstable_cache(
  async function fundingTransactions(revolutionId: string): Promise<IFundingTransaction[]> {
    const revolution = await Revolutions().getById(revolutionId);

    if (!revolution?.auction || !revolution?.addresses?.pointsEmitter) return [];

    const { auction, token } = revolution.addresses;

    const [pointsPurchases, auctions] = await Promise.all([
      database.pointsPurchase.findMany({
        where: {
          address: revolution.addresses.pointsEmitter,
          chainId: revolution.chainId,
        },
        include: { profile: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      auction && token
        ? Auctions().getFinalizedAuctionsForContract(auction, token, revolution.chainId, 5)
        : [],
    ]);

    const grantsRateBps = revolution.auction.grantsRateBps;

    const revolutionAuctionToDao =
      (10_000 - revolution.auction.creatorRateBPS + grantsRateBps) / 10_000;

    const normalizedAuctions: IFundingTransaction[] = auctions.map(a => ({
      transactionHash: a.settlementTransactionHash || "0x",
      buyer: a.winner as `0x${string}`,
      date: a.details.endTime,
      purchase: {
        points: null,
        auctionItem: {
          name: a.name,
          imageUrl: a.tokenMetadata?.image || "",
          tokenId: a.nftTokenId,
        },
      },
      chainId: a.chainId,
      amount: a.winningBid || "0",
      toGrants: BigInt(
        (BigInt(a.winningBid || "0") * BigInt(grantsRateBps)) / BigInt(10_000),
      ).toString(),
      // the winning bid times 10_000 - revolution.auction.creatorRateBps - revolution.auction.grantsRateBps
      toDao:
        (BigInt(a.winningBid || "0") *
          (BigInt(10_000) -
            BigInt(revolution.auction?.creatorRateBPS || "0") +
            BigInt(grantsRateBps))) /
          BigInt(10_000) +
        "",
      profile: a.winnerProfile ? transformProfile(a.winnerProfile) : undefined,
    }));

    const normalizedPoints: IFundingTransaction[] = pointsPurchases.map(p => ({
      transactionHash: p.transactionHash,
      buyer: p.buyer,
      date: p.createdAt,
      purchase: {
        points: p.buyerTokensEmitted ? p.buyerTokensEmitted : null,
        auctionItem: null,
      },
      chainId: p.chainId,
      amount: p.payment,
      toGrants: p.grantsDirectPayment,
      toDao: p.ownerAmount,
      profile: p.profile ? transformProfile(p.profile) : undefined,
    }));

    return normalizedPoints
      .concat(normalizedAuctions)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  },
  undefined,
  { revalidate: 120 },
);
