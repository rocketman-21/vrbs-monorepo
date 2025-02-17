"use client";

import { getChain, isTestnet } from "@cobuild/libs/web3/utils";
import { protocolRewardsAbi } from "@cobuild/protocol-rewards";
import { useContractWrite } from "app/libs/useContractWrite";
import { useReadContract } from "wagmi";

interface Args {
  user: `0x${string}` | null;
  chainId: number;
}

export function getProtocolRewardsAddress(chainId: number) {
  if (isTestnet(chainId)) {
    return "0xa157b8a5d130b81f7540a11a1e0e3b7fc4ce62b9" as const;
  }
  return "0x9f7f714a3cd6b6eadbc9629838b0f6ddeabe1710" as const;
}

export function useProtocolRewardsClaim(args: Args) {
  const { user, chainId } = args;

  const { data, isLoading, refetch } = useReadContract({
    address: getProtocolRewardsAddress(chainId),
    chainId,
    abi: protocolRewardsAbi,
    functionName: "balanceOf",
    args: [user as `0x{$string}`],
  });

  const { write, status } = useContractWrite({
    chainId,
    contract: getProtocolRewardsAddress(chainId),
    type: "withdrawProtocolRewards",
    successText: "Balance claimed!",
    waitingText: "Claiming balance...",
    onSuccess: async () => {
      refetch();
    },
  });

  return {
    eth: data || 0n,
    isLoading,
    refetch,
    claimEth: async () => {
      if (!user) return;
      return await write(client => {
        return client.simulateContract({
          account: user,
          address: getProtocolRewardsAddress(chainId),
          chain: getChain(chainId),
          abi: protocolRewardsAbi,
          functionName: "withdraw",
          args: [user, data || 0n],
        });
      });
    },
    status,
  };
}
