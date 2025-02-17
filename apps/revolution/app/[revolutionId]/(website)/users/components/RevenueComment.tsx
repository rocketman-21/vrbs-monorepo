import { GrowthMetrics } from "@cobuild/database/models/revolution/growth/GrowthMetrics";
import { IRevolution } from "@cobuild/database/types";
import { Ether } from "@cobuild/ui/atoms/Ether";
import Skeleton from "@cobuild/ui/atoms/Skeleton";
import { Suspense } from "react";

interface Props {
  revolution: IRevolution;
}

export const RevenueComment = async (props: Props) => {
  const { revolution } = props;

  if (!revolution.addresses) return null;

  const { addresses, chainId } = revolution;
  const { auction, splitsCreator } = addresses;

  if (!auction || !splitsCreator) return null;

  const growth = GrowthMetrics().getAggregateRevenueGrowth(auction, splitsCreator, chainId);

  return (
    <div className="flex items-center text-lg text-zinc-700 dark:text-zinc-300">
      This week we earned{" "}
      <Suspense fallback={<Skeleton width={100} className="ml-2.5 inline-block" />}>
        <Ether amount={BigInt(Math.round((await growth).splits.weeksRevenue))} symbol="Ξ" />
      </Suspense>{" "}
      for the DAO with splits.
    </div>
  );
};
