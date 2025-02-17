import { GrowthMetrics } from "@cobuild/database/models/revolution/growth/GrowthMetrics";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { getUserSalary } from "@cobuild/database/models/social/Profile";
import { Ether } from "@cobuild/ui/atoms/Ether";
import { PercentChange } from "@cobuild/ui/atoms/PercentChange";
import { MobileConditionalTooltip } from "app/components/MobileConditionalTooltip";
import { SidebarStat } from "app/components/SidebarStat";
import { Votes } from "app/components/Votes";
import { getVotingPower } from "app/libs/vote-power/votingPower";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface Props {
  revolutionId: string;
  address: `0x${string}`;
}

export const UserStats = async (props: Props) => {
  const { revolutionId, address } = props;

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution) notFound();

  const { hasGrants, hasSplits } = revolution;

  const votingPower = getVotingPower(address, revolutionId);
  const salary = hasGrants ? getUserSalary(revolutionId, address) : null;
  const stats = hasSplits
    ? GrowthMetrics().getRevenueMetrics(address, revolution.addresses!.splitsCreator!)
    : null;

  return (
    <section>
      <h3 className="font-medium">Stats</h3>
      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        {salary && (
          <SidebarStat label="Salary">
            <Suspense>
              <span>
                {Intl.NumberFormat("en", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format((await salary).yearly)}
              </span>
              <span className="text-sm">/year</span>
            </Suspense>
          </SidebarStat>
        )}
        <SidebarStat label="Votes">
          <Suspense fallback="...">
            <Votes>{await votingPower}</Votes>
          </Suspense>
        </SidebarStat>

        {hasSplits && (
          <Link href={`/${revolutionId}/rewards/${address}`}>
            <SidebarStat label="Earned for DAO">
              <Suspense>
                <div className="flex flex-row items-center space-x-2">
                  {(async () => {
                    const totalRevenue = (await stats)?.totalRevenue || 0;
                    // If the revenue is less than 0.0001, don't show it
                    const displayRevenue = totalRevenue < 1e18 / 2000 ? 0 : totalRevenue;
                    return <Ether amount={BigInt(Math.round(displayRevenue))} symbol="Ξ" />;
                  })()}
                  <MobileConditionalTooltip subtitle={`Week over week change`}>
                    <div className="ml-2">
                      <PercentChange size="sm" value={(await stats)?.weekOverWeek || 0} />
                    </div>
                  </MobileConditionalTooltip>
                </div>
              </Suspense>
            </SidebarStat>
          </Link>
        )}
      </div>
    </section>
  );
};
