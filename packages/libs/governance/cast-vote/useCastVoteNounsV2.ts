"use client";

import { getAddress } from "viem";
import { useWriteContract } from "wagmi";
import { nounsDaoLogicV2Abi } from "../../web3/wagmi";
import { CastVoteArgs, CastVoteHookResponse } from "./useCastVote";

export const useCastVoteNounsV2 = (
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
          abi: nounsDaoLogicV2Abi,
          functionName: "castRefundableVoteWithReason",
          args: [BigInt(args.proposalId), Number(args.optionId), `${args.reason}`],
          chainId,
        });
      } else {
        writeContract({
          address: getAddress(`${address}`),
          abi: nounsDaoLogicV2Abi,
          functionName: "castRefundableVote",
          args: [BigInt(args.proposalId), Number(args.optionId)],
          chainId,
        });
      }
    },
  };
};
