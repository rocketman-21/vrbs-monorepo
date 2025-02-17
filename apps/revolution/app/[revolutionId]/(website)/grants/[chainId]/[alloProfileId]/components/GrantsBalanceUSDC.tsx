"use client";

import { IGrant, Serialized } from "@cobuild/database/types";
import { AnchorWithdrawUSDC } from "./AnchorWithdrawUSDC";
import { formatEther } from "viem";
import { GrantsWithdrawUSDC } from "./GrantsWithdrawUSDC";

interface Props {
  grant: Serialized<IGrant>;
}

export function GrantsBalanceUSDC(props: Props) {
  const { grant } = props;
  const { usdcBalance } = grant.poolBalance;

  return (
    <div className="inline-block">
      <div className="inline-flex justify-between space-x-3 overflow-hidden rounded-xl border border-zinc-300 p-3 max-sm:mt-6">
        <div className="border-zinc-300">
          <dt className="text-xs text-zinc-600">Claimable USDC</dt>

          <div className="text-lead-500 mt-1.5 text-xl font-medium tracking-tight md:text-2xl">
            ${formatEther(BigInt(usdcBalance * 1e12))}
          </div>

          <div className="mt-2.5">
            {grant.isOpenGrantPool ? (
              <GrantsWithdrawUSDC grant={grant} />
            ) : (
              <AnchorWithdrawUSDC grant={grant} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
