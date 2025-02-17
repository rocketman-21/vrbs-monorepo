import { cacheResult } from "@cobuild/libs/cache";
import { database } from "../../..";
import { cache } from "react";

export function Splits() {
  return {
    getAll,
    countAll,
    getForUser,
    getStats,
  };
}

async function getAll(splitMain: `0x${string}`, chainId: number, page = 1, take = 20) {
  return await database.split.findMany({
    where: { chainId, splitMain },
    orderBy: { earned: "desc" },
    take,
    skip: take * (page - 1),
  });
}

async function countAll(splitMain: `0x${string}`, chainId: number) {
  return await database.split.count({ where: { chainId, splitMain } });
}

async function getForUser(user: `0x${string}`, splitMain: `0x${string}`, chainId: number) {
  return await database.split.findMany({
    where: {
      chainId,
      splitMain,
      OR: [{ controller: user }, { accounts: { has: user } }],
    },
    orderBy: { createdAt: "desc" },
  });
}

const getStats = cache(async (splitMain: `0x${string}`, chainId: number, controller?: string) => {
  return cacheResult(`splits_statistics_${splitMain}_${chainId}_${controller}`, 1200, async () => {
    const [uniqueAccounts, ethEarned, pointsEarned] = await Promise.all([
      countUniqueAccounts(splitMain, chainId, controller),
      getSplitsTotalEarned(splitMain, chainId, controller),
      // just return 0 if controller is provided, else get points earned
      !controller ? getSplitsPointsEarned(splitMain, chainId) : 0,
    ]);

    return {
      uniqueAccounts,
      ethEarned,
      pointsEarned,
    };
  });
});

// in the pointsPurchases collection, find all where chainId and buyer:splitmain, and sum buyerTokensEmitted
const getSplitsPointsEarned = async (
  splitMain: `0x${string}`,
  chainId: number,
): Promise<string | null> => {
  return cacheResult(`splits_pointsEarned_${splitMain}_${chainId}`, 120, async () => {
    const pointsPurchases = (await database.pointsPurchase.aggregateRaw({
      pipeline: [
        {
          $match: {
            chainId,
            buyer: splitMain.toLowerCase(),
          },
        },
        { $addFields: { earned: { $toDouble: "$buyerTokensEmitted" } } },
        {
          $group: {
            _id: null,
            total: { $sum: "$earned" },
          },
        },
      ],
    })) as unknown as { _id: null; total: number }[];

    return pointsPurchases?.[0]?.total.toString() || "0";
  });
};

const getSplitsTotalEarned = async (
  splitMain: `0x${string}`,
  chainId: number,
  controller?: string,
): Promise<{ total: number; dao: number } | null> => {
  return cacheResult(`splits_totalEarned_${splitMain}_${chainId}_${controller}`, 120, async () => {
    const earningsDocs = (await database.split.aggregateRaw({
      pipeline: [
        {
          $match: {
            chainId,
            splitMain: splitMain.toLowerCase(),
            // if controller is provided, only count accounts that are the controller
            ...(controller ? { controller } : {}),
          },
        },
        { $project: { earned: 1, pointsData: { pointsPercent: 1 } } },
      ],
    })) as unknown as { _id: null; earned: string; pointsData: { pointsPercent: number } }[];

    let total = 0;

    let dao = 0;

    const earnings = earningsDocs.reduce(
      (acc, curr) => {
        const earnedNum = Number(curr.earned);
        const daoEarned = earnedNum * (curr.pointsData.pointsPercent / 1e6);
        acc.total += earnedNum;
        acc.dao += daoEarned;
        return acc;
      },
      { total: 0, dao: 0 },
    );

    total = earnings.total;
    dao = earnings.dao;

    return { total, dao };
  });
};

const countUniqueAccounts = cache(
  async (
    splitMain: `0x${string}`,
    chainId: number,
    controller?: string,
  ): Promise<number | null> => {
    return cacheResult(
      `splits_uniqueAccounts_${splitMain}_${chainId}_${controller}`,
      120,
      async () => {
        const uniqueAccounts = await database.split.aggregateRaw({
          pipeline: [
            {
              $match: {
                chainId,
                splitMain: splitMain.toLowerCase(),
                // if controller is provided, only count accounts that are the controller
                ...(controller ? { controller } : {}),
              },
            },
            {
              // group by accounts array of strings
              $unwind: "$accounts",
            },
            {
              $group: { _id: "$accounts" },
            },
            { $project: { _id: 1 } },
          ],
        });

        // return count of unique accounts
        return (uniqueAccounts?.length || 0) as number;
      },
    );
  },
);
