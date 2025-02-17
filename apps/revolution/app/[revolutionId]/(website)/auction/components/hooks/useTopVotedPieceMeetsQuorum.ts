import { cultureIndexAbi } from "@cobuild/revolution";
import { getAddress } from "viem";
import { useReadContract } from "wagmi";

export const useTopVotedPieceMeetsQuorum = (
  contract: `0x${string}`,
  chainId: number,
  enabled: boolean,
) => {
  const { data: meetsQuorum, isLoading } = useReadContract({
    abi: cultureIndexAbi,
    address: getAddress(contract),
    chainId,
    functionName: "topVotedPieceMeetsQuorum",
    query: { enabled },
  });

  return {
    meetsQuorum,
    isLoading,
  };
};
