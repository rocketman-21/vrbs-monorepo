"use client";

import { useContractWrite, useWriteContract } from "wagmi";

import { CastVoteArgs, CastVoteHookResponse } from "./useCastVote";
import { nounsDaoLogicV1Abi } from "../../web3/wagmi";
import { getAddress } from "viem";

export const useCastVoteNounsV1 = (
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
          abi: nounsDaoLogicV1Abi,
          functionName: "castVoteWithReason",
          args: [BigInt(args.proposalId), Number(args.optionId), `${args.reason}`],
          chainId,
        });
      } else {
        writeContract({
          address: getAddress(`${address}`),
          abi: nounsDaoLogicV1Abi,
          functionName: "castVote",
          args: [BigInt(args.proposalId), Number(args.optionId)],
          chainId,
        });
      }
    },
  };
};
