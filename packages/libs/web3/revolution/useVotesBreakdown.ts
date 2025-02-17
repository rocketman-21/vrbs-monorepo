"use client";

import { revolutionVotingPowerAbi } from "@cobuild/revolution";
import { getAddress } from "viem/utils";
import { useAccount, useReadContract } from "wagmi";

type Args = {
  disabled: boolean;
  chainId: number;
  contract?: `0x${string}`;
};

export function useVotesBreakdown(args: Args) {
  const { chainId, contract } = args;
  const { address } = useAccount();

  const { data: pointsBalance, isLoading: isLoadingPoints } = useReadContract({
    abi: revolutionVotingPowerAbi,
    address: contract ? getAddress(contract) : undefined,
    chainId,
    functionName: "getPointsVotes",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !args.disabled },
  });

  const { data: tokenBalance, isLoading: isLoadingTokens } = useReadContract({
    abi: revolutionVotingPowerAbi,
    address: contract ? getAddress(contract) : undefined,
    chainId,
    functionName: "getTokenVotes",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !args.disabled },
  });

  const { data: tokenWeight, isLoading: isLoadingTokenWeight } = useReadContract({
    abi: revolutionVotingPowerAbi,
    address: contract ? getAddress(contract) : undefined,
    chainId,
    functionName: "tokenVoteWeight",
    query: { enabled: !!address && !args.disabled },
  });

  const { data: pointsWeight, isLoading: isLoadingPointsWeight } = useReadContract({
    abi: revolutionVotingPowerAbi,
    address: contract ? getAddress(contract) : undefined,
    chainId,
    functionName: "pointsVoteWeight",
    query: { enabled: !!address && !args.disabled },
  });

  return {
    isLoading: isLoadingPoints || isLoadingTokens || isLoadingTokenWeight || isLoadingPointsWeight,
    points: {
      balance: pointsBalance || BigInt(0),
      weight: pointsWeight || BigInt(0),
      power: (pointsBalance || BigInt(0)) * (pointsWeight || BigInt(0)),
    },
    token: {
      balance: tokenBalance || BigInt(0),
      weight: tokenWeight || BigInt(0),
      power: (tokenBalance || BigInt(0)) * (tokenWeight || BigInt(0)),
    },
  };
}
