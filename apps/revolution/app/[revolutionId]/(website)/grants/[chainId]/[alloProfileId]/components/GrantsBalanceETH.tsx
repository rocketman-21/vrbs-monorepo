"use client";

import { IGrant, Serialized } from "@cobuild/database/types";
import { AnchorWithdrawETH } from "./AnchorWithdrawETH";
import { Ether } from "@cobuild/ui/atoms/Ether";
import { GrantsWithdrawETH } from "./GrantsWithdrawETH";

interface Props {
  grant: Serialized<IGrant>;
}

export function GrantsBalanceETH(props: Props) {
  const { grant } = props;
  const { ethBalance } = grant.poolBalance;

  return (
    <div className="inline-block">
      <div className="inline-flex justify-between space-x-3 overflow-hidden rounded-xl border border-zinc-300 p-3 max-sm:mt-6">
        <div className="border-zinc-300">
          <dt className="text-xs text-zinc-600">Claimable ETH</dt>
          <div className="flex flex-row space-x-16">
            <div className="text-lead-500 mt-1.5 text-xl font-medium tracking-tight md:text-2xl">
              <Ether symbol="Ξ" amount={BigInt(ethBalance)} />
            </div>
          </div>

          <div className="mt-2.5">
            {grant.isOpenGrantPool ? (
              <GrantsWithdrawETH grant={grant} />
            ) : (
              <AnchorWithdrawETH grant={grant} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
