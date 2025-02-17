export const dynamic = "force-dynamic";

import "server-only";

import { NextRequest } from "next/server";
import { database } from "@cobuild/database";
import { GrowthMetrics } from "@cobuild/database/models/revolution/growth/GrowthMetrics";
import { base } from "viem/chains";

export async function GET(req: NextRequest) {
  try {
    const splits = await database.split.findMany({
      where: {
        controller: {
          not: "0x4b483c71e09d3a49c81312067364fa18d730528d",
        },
      },
      select: {
        id: true,
        splitMain: true,
        split: true,
        createdAt: true,
        pointsData: true,
        chainId: true,
        controller: true,
      },
    });

    const splitMainsAndChains = Array.from(
      new Set(splits.map(split => `${split.chainId}-${split.splitMain}`)),
    ).map(item => {
      const [chainId, splitMain] = item.split("-");
      return { chainId: Number(chainId), splitMain };
    });

    const revenueEvents = (
      await Promise.all(
        splitMainsAndChains.map(split =>
          GrowthMetrics().getRevenueEvents(split.chainId, split.splitMain as `0x${string}`),
        ),
      )
    ).flat();

    const groupedSplits = splits.reduce<Record<string, typeof splits>>((acc, split) => {
      const key = `${split.controller}-${split.splitMain}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(split);
      return acc;
    }, {});

    const bulkWriteOps: {
      q: {
        address: string;
        splitMain: string;
      };
      u: {
        $set: {
          weekRevenue: number;
          previousWeekRevenue: number;
          weekOverWeek: number;
          monthRevenue: number;
          previousMonthRevenue: number;
          monthOverMonth: number;
          totalRevenue: number;
          updatedAt: { $date: Date };
        };
      };
      upsert: boolean;
    }[] = [];

    const { week, month, previousWeek, previousMonth } = await GrowthMetrics().getStartAndEndBlock(
      base.id,
    );

    for (const key in groupedSplits) {
      const splitsArray = groupedSplits[key];

      const filteredRevenueEvents = revenueEvents.filter(event =>
        splitsArray.some(
          split => split.split.toLowerCase() === event.decoded?.args?.split?.toLowerCase(),
        ),
      );

      const weekRevenue = GrowthMetrics().calculateRevenueForSplits(
        filteredRevenueEvents,
        week.startBlock,
        week.endBlock,
        splitsArray,
      );
      const previousWeekRevenue = GrowthMetrics().calculateRevenueForSplits(
        filteredRevenueEvents,
        previousWeek.startBlock,
        previousWeek.endBlock,
        splitsArray,
      );
      const monthRevenue = GrowthMetrics().calculateRevenueForSplits(
        filteredRevenueEvents,
        month.startBlock,
        month.endBlock,
        splitsArray,
      );
      const previousMonthRevenue = GrowthMetrics().calculateRevenueForSplits(
        filteredRevenueEvents,
        previousMonth.startBlock,
        previousMonth.endBlock,
        splitsArray,
      );
      const totalRevenue = GrowthMetrics().calculateRevenueForSplits(
        filteredRevenueEvents,
        0,
        1e18,
        splitsArray,
      );

      const weekOverWeek = previousWeekRevenue
        ? (weekRevenue - previousWeekRevenue) / previousWeekRevenue
        : 0;
      const monthOverMonth = previousMonthRevenue
        ? (monthRevenue - previousMonthRevenue) / previousMonthRevenue
        : 0;

      console.log({
        weekRevenue,
        previousWeekRevenue,
        weekOverWeek,
        monthRevenue,
        previousMonthRevenue,
        monthOverMonth,
        totalRevenue,
      });

      bulkWriteOps.push({
        q: {
          address: splitsArray[0].controller,
          splitMain: splitsArray[0].splitMain,
        },
        u: {
          $set: {
            weekRevenue,
            previousWeekRevenue,
            weekOverWeek,
            monthRevenue,
            previousMonthRevenue,
            monthOverMonth,
            totalRevenue,
            updatedAt: { $date: new Date() },
          },
        },
        upsert: true,
      });
    }

    await database.$runCommandRaw({
      update: "revenueMetrics",
      updates: bulkWriteOps,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e: any) {
    console.error({ error: e });

    return new Response(e.message, {
      status: 500,
    });
  }
}
