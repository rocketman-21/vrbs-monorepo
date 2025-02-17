import sumBy from "lodash/sumBy";
import { formatEther } from "viem";
import { IGrant, Serialized } from "../../database/types";

export function calculateUserSalary(grants: Serialized<IGrant>[]) {
  const monthlyFlowRate = sumBy(grants, g => g.monthlyFlowRatePerMember);

  const monthly = Number(formatEther(BigInt(Math.round(monthlyFlowRate))));
  const yearly = monthly * 12;

  const totalEarned = sumBy(grants, g => g.poolBalance.totalEarnedPerMember);
  const totalUnclaimed = sumBy(
    grants,
    g => g.poolBalance.superTokenBalance || g.poolBalance.claimableBalance,
  );

  const memberFlowRate = sumBy(grants, g => g.memberFlowRatePerMember);

  return { monthly, yearly, totalEarned, totalUnclaimed, monthlyFlowRate, memberFlowRate };
}

export type IUserSalary = ReturnType<typeof calculateUserSalary>;
