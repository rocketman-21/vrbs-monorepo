"use client";

import { getAddress } from "viem";
import { useWriteContract } from "wagmi";
import { nounsBuilderGovernorV1Abi } from "../../web3/wagmi";
import { CastVoteArgs, CastVoteHookResponse } from "./useCastVote";

export const useCastVoteNounsBuilder = (
  address: `0x${string}` | undefined,
  args: CastVoteArgs,
  chainId: number,
): CastVoteHookResponse => {
  const { data, isPending, error, writeContract } = useWriteContract({
    mutation: { onError: args.onError },
  });

  return {
    isLoading: isPending,
    hash: data,
    error,
    write: () => {
      if (args.reason) {
        writeContract({
          address: getAddress(`${address}`),
          abi: nounsBuilderGovernorV1Abi,
          functionName: "castVoteWithReason",
          args: [args.proposalId as `0x${string}`, BigInt(args.optionId || 0), `${args.reason}`],
          chainId,
        });
      } else {
        writeContract({
          address: getAddress(`${address}`),
          abi: nounsBuilderGovernorV1Abi,
          functionName: "castVote",
          args: [args.proposalId as `0x${string}`, BigInt(args.optionId || 0)],
          chainId,
        });
      }
    },
  };
};
