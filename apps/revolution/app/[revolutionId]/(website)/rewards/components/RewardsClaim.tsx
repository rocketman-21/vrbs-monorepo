"use client";

import { Button } from "@cobuild/ui/atoms/Button";
import { Ether } from "@cobuild/ui/atoms/Ether";
import { Votes } from "app/components/Votes";
import { VotingPowerIcon } from "app/components/VotingPowerIcon";
import clsx from "classnames";
import { useRewardsClaim } from "./useRewardsClaim";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";

interface Props {
  user: `0x${string}` | null;
  chainId: number;
  splitsCreator: `0x${string}`;
}

export const RewardsClaim = (props: Props) => {
  const { user, chainId, splitsCreator } = props;

  const { balance, claimEth, claimPoints, status, splits, protocolRewards } = useRewardsClaim({
    user,
    chainId,
    splitsCreator,
  });

  return (
    <dl className="grid shrink-0 grid-cols-2 overflow-hidden rounded-md border border-zinc-200 max-sm:mt-6 md:min-w-[520px]">
      <div className="border-r border-zinc-200 p-4 md:p-5">
        <dt className="text-xs font-medium text-zinc-500 md:text-sm">Claimable earnings</dt>
        <dd
          className={clsx("mt-1.5 text-xl font-semibold tracking-tight text-zinc-900 md:text-3xl", {
            "animate-pulse": balance.isLoading,
          })}
        >
          <Ether symbol="ETH" amount={balance.eth} />
        </dd>
        <Tooltip
          subtitle={
            <div className="text-left">
              From Splits: <Ether symbol="Ξ" amount={splits.eth} />
              <br />
              Protocol Rewards: <Ether symbol="Ξ" amount={protocolRewards.eth} />
              <br />
              USDC: ${balance.usdc || 0}
            </div>
          }
          position="bottom"
        >
          <Button
            type="button"
            disabled={status !== "idle" || balance.eth < 1n}
            color={balance.eth > 1n ? "primary" : "outline"}
            className="mt-2.5"
            onClick={claimEth}
          >
            Claim Ξ
          </Button>
        </Tooltip>
      </div>
      <div className="p-4 md:p-5">
        <dt className="text-xs font-medium text-zinc-500 md:text-sm">Claimable votes</dt>
        <dd
          className={clsx("mt-1.5 text-xl font-semibold tracking-tight text-zinc-900 md:text-3xl", {
            "animate-pulse": balance.isLoading,
          })}
        >
          <Votes>{balance.points}</Votes> votes
        </dd>
        <Button
          disabled={status !== "idle" || balance.points === 0n}
          color={balance.points > 0n ? "primary" : "outline"}
          className="mt-2.5"
          onClick={claimPoints}
        >
          Claim <VotingPowerIcon className="ml-1.5 size-3.5" />
        </Button>
      </div>
    </dl>
  );
};
