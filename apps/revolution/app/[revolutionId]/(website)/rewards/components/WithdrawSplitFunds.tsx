"use client";

import { DistributeSplit } from "./DistributeSplit";
import { WithdrawZoraRewards } from "./WithdrawZoraRewards";
import { Split } from "prisma-database";
import { useBalance, useReadContract } from "wagmi";
import { getAddress } from "viem";
import { protocolRewardsAbi } from "@cobuild/protocol-rewards";
import { splitMainAbi } from "@cobuild/splits";
import { DistributeSplitUSDC } from "./DistributeSplitUSDC";

const zoraRewardsContract = "0x7777777f279eba3d3ad8f4e708545291a6fdba8b";
const usdcOnBase = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";

interface WithdrawSplitFundsProps {
  splitsCreator: `0x${string}`;
  split: Split;
}

export function WithdrawSplitFunds({ splitsCreator, split }: WithdrawSplitFundsProps) {
  const { chainId, split: splitAddress } = split;

  const {
    data: ethBalance,
    refetch: refetchEthBalance,
    isLoading: isEthBalanceLoading,
  } = useBalance({
    chainId,
    address: getAddress(splitAddress),
    query: { staleTime: 10_000 },
  });

  const {
    data: zoraBalance,
    refetch: refetchZoraBalance,
    isLoading: isZoraBalanceLoading,
  } = useReadContract({
    address: zoraRewardsContract,
    chainId,
    functionName: "balanceOf",
    abi: protocolRewardsAbi,
    args: [splitAddress as `0x${string}`],
  });

  const {
    data: erc20Balance,
    refetch: refetchErc20Balance,
    isLoading: isErc20BalanceLoading,
  } = useReadContract({
    address: splitsCreator,
    chainId,
    functionName: "getERC20Balance",
    abi: splitMainAbi,
    args: [splitAddress as `0x${string}`, usdcOnBase],
  });

  const refetchBalances = async () => {
    await Promise.all([refetchEthBalance(), refetchZoraBalance(), refetchErc20Balance()]);
  };

  const hasEthBalance = ethBalance && BigInt(ethBalance.value) > BigInt(0);
  const hasZoraBalance = zoraBalance && zoraBalance > BigInt(0);
  const hasErc20Balance = erc20Balance && erc20Balance > BigInt(1);

  const showDistributeSplit = !hasZoraBalance && !hasErc20Balance;
  const showDistributeSplitERC20 = !hasZoraBalance && !hasEthBalance && hasErc20Balance;

  return (
    <div className="flex flex-col justify-between space-y-2">
      {hasZoraBalance && (
        <WithdrawZoraRewards
          split={split}
          balance={zoraBalance}
          isLoading={isZoraBalanceLoading}
          refetch={refetchBalances}
        />
      )}
      {showDistributeSplit && (
        <DistributeSplit
          splitsCreator={splitsCreator}
          split={split}
          balance={ethBalance}
          isLoading={isEthBalanceLoading}
          refetch={refetchBalances}
        />
      )}
      {showDistributeSplitERC20 && (
        <DistributeSplitUSDC
          splitsCreator={splitsCreator}
          split={split}
          balance={erc20Balance}
          isLoading={isErc20BalanceLoading}
          refetch={refetchBalances}
          tokenAddress={usdcOnBase}
        />
      )}
    </div>
  );
}
