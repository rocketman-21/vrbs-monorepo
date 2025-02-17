"use client";

import { maxHeapAbi } from "@cobuild/revolution";
import { getAddress } from "viem/utils";
import { useReadContract } from "wagmi";

type Args = {
  chainId: number;
  contractAddress?: `0x${string}`;
  disabled?: boolean;
};

export function useMaxHeapSize(args: Args) {
  const { chainId, contractAddress } = args;

  const { data: size, isLoading } = useReadContract({
    abi: maxHeapAbi,
    address: contractAddress ? getAddress(contractAddress) : undefined,
    chainId,
    functionName: "size",
    query: { enabled: !args.disabled && !!contractAddress },
  });

  return {
    size,
    isLoading,
  };
}
