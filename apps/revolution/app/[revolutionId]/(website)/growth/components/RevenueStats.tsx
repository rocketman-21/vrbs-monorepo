import "server-only";

import { GrowthMetrics } from "@cobuild/database/models/revolution/growth/GrowthMetrics";
import { IRevolution } from "@cobuild/database/types";
import { Ether } from "@cobuild/ui/atoms/Ether";
import { GrowthStat } from "app/components/GrowthStat";

interface Props {
  revolution: IRevolution;
}

export const RevenueStats = async (props: Props) => {
  const { revolution } = props;

  if (!revolution.addresses?.auction || !revolution.addresses?.splitsCreator) return null;

  const aggregateRevenueGrowth = await GrowthMetrics().getAggregateRevenueGrowth(
    revolution.addresses.auction,
    revolution.addresses.splitsCreator,
    revolution.chainId,
  );

  const {
    auction,
    splits,
    totalWeekRevenue,
    totalMonthRevenue,
    totalMonthPercentChange,
    totalWeekPercentChange,
  } = aggregateRevenueGrowth;

  return (
    <section className="px-4">
      <div className="mx-auto w-full max-w-[640px]">
        <div className="w-full">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Weekly Revenue</h2>
          <div className="mt-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-3">
            <GrowthStat label="Total" percentChange={totalWeekPercentChange}>
              <Ether amount={BigInt(totalWeekRevenue)} symbol="Ξ" />
            </GrowthStat>
            <GrowthStat label="Auction" percentChange={auction.weekOverWeek}>
              <Ether amount={BigInt(auction.weeksRevenue)} symbol="Ξ" />
            </GrowthStat>
            <GrowthStat label="Splits" percentChange={splits.weekOverWeek}>
              <Ether amount={BigInt(splits.weeksRevenue)} symbol="Ξ" />
            </GrowthStat>
          </div>
        </div>
        <div className="mt-8 w-full">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
            Monthly Revenue
          </h2>
          <div className="mt-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-3">
            <GrowthStat label="Total" percentChange={totalMonthPercentChange}>
              <Ether amount={BigInt(totalMonthRevenue)} symbol="Ξ" />
            </GrowthStat>
            <GrowthStat label="Auction" percentChange={auction.monthOverMonth}>
              <Ether amount={BigInt(auction.monthsRevenue)} symbol="Ξ" />
            </GrowthStat>
            <GrowthStat label="Splits" percentChange={splits.monthOverMonth}>
              <Ether amount={BigInt(splits.monthsRevenue)} symbol="Ξ" />
            </GrowthStat>
          </div>
        </div>
      </div>
    </section>
  );
};
