"use client";

import { getChain } from "@cobuild/libs/web3/utils";
import { multiCall3Abi, multiCall3Address } from "@cobuild/libs/web3/wagmi";
import { protocolRewardsAbi } from "@cobuild/protocol-rewards";
import { splitMainAbi } from "@cobuild/splits";
import { useContractWrite } from "app/libs/useContractWrite";
import { useMemo, useState } from "react";
import { encodeFunctionData } from "viem";
import { getProtocolRewardsAddress, useProtocolRewardsClaim } from "./useProtocolRewardsClaim";
import { useSplitsClaim } from "./useSplitsClaim";

interface Args {
  user: `0x${string}` | null;
  splitsCreator: `0x${string}`;
  chainId: number;
}

export function useRewardsClaim(args: Args) {
  const { user, chainId, splitsCreator } = args;

  const splits = useSplitsClaim({ user, chainId, splitsCreator });
  const protocolRewards = useProtocolRewardsClaim({ user, chainId });

  const [type, setType] = useState<"multicall" | "protocol-rewards" | "splits">();

  const { write, status: multicallStatus } = useContractWrite({
    chainId,
    contract: splitsCreator,
    type: "withdrawSplit",
    trackerType: "revolution_split",
    successText: "Balance claimed!",
    waitingText: "Claiming balance...",
    onSuccess: async () => {
      splits.refetch();
      protocolRewards.refetch();
    },
  });

  const status = useMemo(() => {
    switch (type) {
      case "multicall":
        return multicallStatus;
      case "splits":
        return splits.status;
      case "protocol-rewards":
        return protocolRewards.status;
      default:
        return "idle";
    }
  }, [type, multicallStatus, splits.status, protocolRewards.status]);

  return {
    splits,
    protocolRewards,

    balance: {
      eth: splits.eth + protocolRewards.eth,
      points: splits.points,
      usdc: splits.usdc,
      isLoading: splits.isLoading || protocolRewards.isLoading,
    },

    claimPoints: () => {
      setType("splits");
      splits.claimPoints();
    },

    claimEth: async () => {
      if (!user) return;
      if (splits.isLoading || protocolRewards.isLoading) return;
      if (splits.eth === 0n && protocolRewards.eth === 0n) return;

      if (splits.eth > 0n && protocolRewards.eth === 0n) {
        setType("splits");
        return await splits.claimEth();
      }

      if (protocolRewards.eth > 0n && splits.eth === 0n) {
        setType("protocol-rewards");
        return await protocolRewards.claimEth();
      }

      setType("multicall");

      const withdrawFromSplit = {
        target: splitsCreator,
        allowFailure: false,
        callData: encodeFunctionData({
          abi: splitMainAbi,
          functionName: "withdraw",
          // withdraw ETH 1, points 0
          args: [user, 1n, 0n, []],
        }),
      };

      const withdrawFromProtocolRewards = {
        target: getProtocolRewardsAddress(chainId),
        allowFailure: false,
        callData: encodeFunctionData({
          abi: protocolRewardsAbi,
          functionName: "withdrawFor",
          args: [user, protocolRewards.eth],
        }),
      };

      return await write(client => {
        return client.simulateContract({
          abi: multiCall3Abi,
          chain: getChain(chainId),
          address: multiCall3Address[1],
          functionName: "aggregate3",
          args: [[withdrawFromProtocolRewards, withdrawFromSplit]],
          account: user,
        });
      });
    },
    status,
  };
}
