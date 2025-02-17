"use client";

import { getChain } from "@cobuild/libs/web3/utils";
import { splitMainAbi } from "@cobuild/splits";
import { useContractWrite } from "app/libs/useContractWrite";
import { useReadContracts } from "wagmi";

interface Args {
  user: `0x${string}` | null;
  splitsCreator: `0x${string}`;
  chainId: number;
}

const baseAddressUSDC = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";

export function useSplitsClaim(args: Args) {
  const { user, chainId, splitsCreator } = args;

  const contract = { address: splitsCreator, chainId, abi: splitMainAbi } as const;

  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      { ...contract, functionName: "getETHBalance", args: [user as `0x{$string}`] },
      { ...contract, functionName: "getPointsBalance", args: [user as `0x{$string}`] },
      {
        ...contract,
        functionName: "getERC20Balance",
        args: [user as `0x{$string}`, baseAddressUSDC],
      },
    ],
    query: {
      enabled: !!contract.address && !!user,
      select: data => {
        const [ethBalance, pointsBalance, usdcBalance] = data;
        return {
          eth: ethBalance.result || 0n,
          points: pointsBalance.result || 0n,
          usdc: usdcBalance.result || 0n,
        };
      },
    },
  });

  const { write, status } = useContractWrite({
    chainId,
    contract: splitsCreator,
    type: "withdrawSplit",
    trackerType: "revolution_split",
    successText: "Balance claimed!",
    waitingText: "Claiming balance...",
    onSuccess: async () => {
      refetch();
    },
  });

  return {
    eth: data ? data.eth : 0n,
    points: data ? data.points : 0n,
    usdc: data ? data.usdc : 0n,
    isLoading,
    refetch,
    claimEth: async () => {
      if (!user) return;
      return await write(client => {
        return client.simulateContract({
          account: user,
          address: splitsCreator,
          chain: getChain(chainId),
          abi: splitMainAbi,
          functionName: "withdraw",
          // withdraw ETH 1, points 0
          args: [user, 1n, 0n, data?.usdc ? [baseAddressUSDC] : []],
        });
      });
    },
    claimPoints: async () => {
      if (!user) return;
      return await write(client => {
        return client.simulateContract({
          account: user,
          address: splitsCreator,
          chain: getChain(chainId),
          abi: splitMainAbi,
          functionName: "withdraw",
          // withdraw ETH 0, points 1
          args: [user, 0n, 1n, data?.usdc ? [baseAddressUSDC] : []],
        });
      });
    },
    status,
  };
}
