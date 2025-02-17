import "server-only";

import { getClient } from "@cobuild/libs/web3/viem/clients";
import { unstable_cache } from "next/cache";
import { Split } from "prisma-database";
import { database } from "../../..";

export function GrowthMetrics() {
  return {
    getAggregateRevenueGrowth,
    getRevenueEvents,
    calculateRevenueForSplits,
    getStartAndEndBlock,
    getRevenueMetrics,
    getRevenueMetricsForSplit,
  };
}

const getAuctionRevenueGrowth = async (
  auctionContractAddress: string,
  chainId: number,
): Promise<{
  weekOverWeek: number;
  monthOverMonth: number;
  weeksRevenue: number;
  monthsRevenue: number;
  previousWeeksRevenue: number;
  previousMonthsRevenue: number;
}> => {
  const totalBidVolumeRaw = await unstable_cache(
    async () => {
      return database.auction.findMany({
        where: {
          chainId,
          auctionContractAddress: auctionContractAddress.toLowerCase(),
          winningBid: { not: null },
        },
        select: {
          winningBid: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 60,
      });
    },
    [`${chainId}`, auctionContractAddress],
    { revalidate: 86400 },
  )();

  const weekBidVolume = totalBidVolumeRaw
    .slice(0, 7)
    .reduce((sum, auction) => sum + parseFloat(auction.winningBid || "0"), 0);

  const previousWeekBidVolume = totalBidVolumeRaw
    .slice(7, 14)
    .reduce((sum, auction) => sum + parseFloat(auction.winningBid || "0"), 0);

  const monthBidVolume = totalBidVolumeRaw
    .slice(0, 30)
    .reduce((sum, auction) => sum + parseFloat(auction.winningBid || "0"), 0);

  const previousMonthBidVolume = totalBidVolumeRaw
    .slice(30, 60)
    .reduce((sum, auction) => sum + parseFloat(auction.winningBid || "0"), 0);

  const weekOverWeek = previousWeekBidVolume
    ? (weekBidVolume - previousWeekBidVolume) / previousWeekBidVolume
    : 0;
  const monthOverMonth = previousMonthBidVolume
    ? (monthBidVolume - previousMonthBidVolume) / previousMonthBidVolume
    : 0;

  return {
    weekOverWeek,
    weeksRevenue: weekBidVolume,
    monthsRevenue: monthBidVolume,
    monthOverMonth,
    previousWeeksRevenue: previousWeekBidVolume,
    previousMonthsRevenue: previousMonthBidVolume,
  };
};

const DISTRIBUTE_ETH_TOPIC_0 = "0x87c3ca0a87d9b82033e4bc55e6d30621f8d7e0c9d8ca7988edfde8932787b77b";

interface TypedRevenueEvent {
  decoded?: { args?: { amount: string; split: string } };
  blockNumber: number;
  address: string;
}

const getRevenueEvents = async (chainId: number, splitMain: `0x${string}`) => {
  const totalRevenueRaw = await unstable_cache(
    async () => {
      return database.onchainEvent.findMany({
        where: {
          address: splitMain,
          chainId,
        },
        select: {
          decoded: true,
          blockNumber: true,
          topics: true,
          address: true,
        },
        take: 1000,
      });
    },
    [`${chainId}`, splitMain],
    { revalidate: 300 },
  )();

  const filteredRevenueRaw = totalRevenueRaw.filter(
    event => event.topics[0] === DISTRIBUTE_ETH_TOPIC_0,
  );

  return filteredRevenueRaw as TypedRevenueEvent[];
};

const getBlockRange = (chainId: number) => {
  const blocksPerSecond = 1 / 2; // 1 block every 2 seconds
  const blocksPerWeek = blocksPerSecond * 60 * 60 * 24 * 7;
  const blocksPerMonth = blocksPerSecond * 60 * 60 * 24 * 30;
  return { blocksPerWeek, blocksPerMonth };
};

// get start and end block based on time frame
const getStartAndEndBlock = async (chainId: number) => {
  const client = getClient(chainId);
  const { blocksPerWeek, blocksPerMonth } = getBlockRange(chainId);
  const latestBlock = await client.getBlock({ blockTag: "latest" });
  const latestBlockNumber = Number(latestBlock.number);
  return {
    week: {
      startBlock: latestBlockNumber - blocksPerWeek,
      endBlock: latestBlockNumber,
    },
    previousWeek: {
      startBlock: latestBlockNumber - blocksPerWeek - blocksPerWeek,
      endBlock: latestBlockNumber - blocksPerWeek,
    },
    month: {
      startBlock: latestBlockNumber - blocksPerMonth,
      endBlock: latestBlockNumber,
    },
    previousMonth: {
      startBlock: latestBlockNumber - blocksPerMonth - blocksPerMonth,
      endBlock: latestBlockNumber - blocksPerMonth,
    },
  };
};

const calculateRevenueForSplits = (
  records: TypedRevenueEvent[],
  startBlock: number,
  endBlock: number,
  splits: Pick<Split, "id" | "pointsData" | "split">[],
) => {
  const parseRevenue = (amount: string) => parseInt(amount, 10); // Convert from wei string to int

  return records
    .filter(record => record.blockNumber >= startBlock && record.blockNumber < endBlock)
    .reduce((sum, record) => {
      const split = splits.find(
        split => split.split.toLowerCase() === record.decoded?.args?.split?.toLowerCase(),
      );
      const pointsPercent = split ? split.pointsData.pointsPercent / 1e6 : 1;
      return (
        sum +
        (record.decoded?.args?.amount
          ? parseRevenue(record.decoded.args.amount) * pointsPercent
          : 0)
      );
    }, 0 as number);
};

const getSplitRevenueGrowth = async (
  splitMain: `0x${string}`,
  chainId: number,
): Promise<{
  weekOverWeek: number;
  weeksRevenue: number;
  monthsRevenue: number;
  monthOverMonth: number;
  previousWeeksRevenue: number;
  previousMonthsRevenue: number;
}> => {
  const allSplits = await unstable_cache(
    async () => {
      return database.split.findMany({
        where: {
          chainId,
          splitMain: splitMain.toLowerCase(),
        },
        select: {
          id: true,
          pointsData: true,
          split: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    },
    [`${chainId}`, splitMain],
    { revalidate: 3600 },
  )();

  const typedRevenueRaw = await getRevenueEvents(chainId, splitMain);

  const { week, month, previousWeek, previousMonth } = await getStartAndEndBlock(chainId);

  const weekRevenue = calculateRevenueForSplits(
    typedRevenueRaw,
    week.startBlock,
    week.endBlock,
    allSplits,
  );
  const previousWeekRevenue = calculateRevenueForSplits(
    typedRevenueRaw,
    previousWeek.startBlock,
    previousWeek.endBlock,
    allSplits,
  );
  const monthRevenue = calculateRevenueForSplits(
    typedRevenueRaw,
    month.startBlock,
    month.endBlock,
    allSplits,
  );
  const previousMonthRevenue = calculateRevenueForSplits(
    typedRevenueRaw,
    previousMonth.startBlock,
    previousMonth.endBlock,
    allSplits,
  );

  const weekOverWeek = previousWeekRevenue
    ? (weekRevenue - previousWeekRevenue) / previousWeekRevenue
    : 0;
  const monthOverMonth = previousMonthRevenue
    ? (monthRevenue - previousMonthRevenue) / previousMonthRevenue
    : 0;

  return {
    weekOverWeek,
    weeksRevenue: weekRevenue,
    monthsRevenue: monthRevenue,
    monthOverMonth,
    previousWeeksRevenue: previousWeekRevenue,
    previousMonthsRevenue: previousMonthRevenue,
  };
};

const getAggregateRevenueGrowth = async (
  auctionContractAddress: string,
  splitMain: `0x${string}`,
  chainId: number,
): Promise<{
  auction: {
    weekOverWeek: number;
    monthOverMonth: number;
    weeksRevenue: number;
    monthsRevenue: number;
    previousWeeksRevenue: number;
    previousMonthsRevenue: number;
  };
  splits: {
    weekOverWeek: number;
    monthOverMonth: number;
    weeksRevenue: number;
    monthsRevenue: number;
    previousWeeksRevenue: number;
    previousMonthsRevenue: number;
  };
  totalWeekRevenue: number;
  totalMonthRevenue: number;
  totalPreviousWeekRevenue: number;
  totalPreviousMonthRevenue: number;
  totalWeekPercentChange: number;
  totalMonthPercentChange: number;
}> => {
  const [auctionGrowth, splitGrowth] = await Promise.all([
    getAuctionRevenueGrowth(auctionContractAddress, chainId),
    getSplitRevenueGrowth(splitMain, chainId),
  ]);

  const totalWeekRevenue = auctionGrowth.weeksRevenue + splitGrowth.weeksRevenue;
  const totalMonthRevenue = auctionGrowth.monthsRevenue + splitGrowth.monthsRevenue;
  const totalPreviousWeekRevenue =
    auctionGrowth.previousWeeksRevenue + splitGrowth.previousWeeksRevenue;
  const totalPreviousMonthRevenue =
    auctionGrowth.previousMonthsRevenue + splitGrowth.previousMonthsRevenue;

  const totalWeekPercentChange =
    (totalWeekRevenue - totalPreviousWeekRevenue) / totalPreviousWeekRevenue;
  const totalMonthPercentChange =
    (totalMonthRevenue - totalPreviousMonthRevenue) / totalPreviousMonthRevenue;

  return {
    auction: auctionGrowth,
    splits: splitGrowth,
    totalWeekRevenue,
    totalMonthRevenue,
    totalPreviousWeekRevenue,
    totalPreviousMonthRevenue,
    totalWeekPercentChange,
    totalMonthPercentChange,
  };
};

export const getRevenueMetrics = unstable_cache(
  async (address: string, splitMain: string) => {
    return database.revenueMetrics.findFirst({
      where: {
        address,
        splitMain,
      },
    });
  },
  undefined,
  { revalidate: 600 }, // Cache TTL of 10 minutes
);

export const getRevenueMetricsForSplit = unstable_cache(
  async (splitMain: string, ignoreAddress?: string) => {
    return await database.revenueMetrics.findMany({
      where: { splitMain, address: { not: ignoreAddress } },
    });
  },
  undefined,
  { revalidate: 600 }, // Cache TTL of 10 minutes
);
