import { GrowthMetrics } from "@cobuild/database/models/revolution/growth/GrowthMetrics";
import { IRevolution } from "@cobuild/database/types";
import { getEthAddress } from "@cobuild/libs/utils/account";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { Ether } from "@cobuild/ui/atoms/Ether";
import { PercentChange } from "@cobuild/ui/atoms/PercentChange";
import { SkeletonRow } from "@cobuild/ui/atoms/Skeleton";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { UserProfile } from "app/components/user-profile/UserProfile";
import Link from "next/link";
import { Suspense } from "react";

interface Props {
  revolution: IRevolution;
}

export const EarnedForDaoLeaderboard = async (props: Props) => {
  const { revolution } = props;
  const { addresses } = revolution;

  if (!addresses?.splitsCreator || !addresses.executor) return null;

  const metrics = GrowthMetrics().getRevenueMetricsForSplit(
    addresses.splitsCreator,
    addresses.executor,
  );

  return (
    <div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Weekly Earners</h3>
      <h4 className="text-sm text-zinc-500 dark:text-zinc-400">
        Builders earning for the DAO. Top 3 split 750 $vrbs every week.
      </h4>
      <div className="dark:bg-card mt-4 rounded-lg border border-zinc-200 bg-white p-4 lg:p-5 dark:border-zinc-800">
        <table className="w-full">
          <thead className="border-b border-white/10 text-left text-sm">
            <tr>
              <th scope="col" className="py-2 pr-4 font-semibold">
                User
              </th>
              <th scope="col" className="py-2 text-right font-semibold">
                Earned for DAO
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/10">
            <Suspense fallback={<SkeletonRow count={10} colSpan={2} height={32} rounded />}>
              {(await metrics)
                .sort((a, b) => {
                  if (b.weekRevenue === a.weekRevenue) {
                    return b.totalRevenue - a.totalRevenue;
                  }
                  return b.weekRevenue - a.weekRevenue;
                })
                .slice(0, 10)
                .map(metric => (
                  <tr key={`${metric.id}`}>
                    <td className="py-2 pr-8">
                      <UserProfile
                        address={getEthAddress(metric.address)}
                        revolutionId={revolution.revolutionId}
                      >
                        {profile => (
                          <div className="flex items-center space-x-2.5">
                            <Avatar id={profile.address} imageUrl={profile.profilePicture} />
                            <Link
                              href={`/${revolution.revolutionId}/users/${profile.username}`}
                              className="hover:text-lead-500 dark:hover:text-lead-300 text-xs font-medium text-zinc-700 duration-100 ease-in-out md:text-sm dark:text-zinc-200"
                            >
                              {profile.displayUsername}
                            </Link>
                          </div>
                        )}
                      </UserProfile>
                    </td>

                    <td className="py-2 text-sm text-zinc-700 dark:text-zinc-200">
                      <div className="flex items-center justify-end space-x-2.5">
                        <span className="max-sm:hidden">
                          {metric.weekOverWeek !== 0 && (
                            <Tooltip
                              subtitle={
                                <>
                                  Previous week:{" "}
                                  <Ether
                                    amount={BigInt(Math.round(metric.previousWeekRevenue))}
                                    symbol="Ξ"
                                  />
                                </>
                              }
                            >
                              <PercentChange size="sm" value={metric.weekOverWeek} />
                            </Tooltip>
                          )}
                        </span>
                        <Link href={`/${revolution.revolutionId}/rewards/${metric.address}`}>
                          <span>
                            <Ether amount={BigInt(Math.round(metric.weekRevenue))} symbol="Ξ" />
                          </span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
            </Suspense>
          </tbody>
        </table>
      </div>
    </div>
  );
};
