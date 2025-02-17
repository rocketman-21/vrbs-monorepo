"use client";

import { cultureIndexAbi } from "@cobuild/revolution";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { getPosition } from "./piecePosition";

type Args = {
  enabled: boolean;
  pieceId: bigint;
  contractAddress: `0x${string}` | null;
  chainId: number | null;
};

export function usePiecePosition(args: Args) {
  const { enabled, pieceId, contractAddress, chainId } = args;
  const [position, setPosition] = useState<number | null>(null);

  const { data: votesWeight, refetch } = useReadContract({
    abi: cultureIndexAbi,
    address: contractAddress || undefined,
    chainId: chainId || undefined,
    functionName: "totalVoteWeights",
    args: pieceId ? [BigInt(pieceId)] : undefined,
    query: { enabled },
  });

  const { data: pieceCount, refetch: refetchCount } = useReadContract({
    abi: cultureIndexAbi,
    address: contractAddress || undefined,
    chainId: chainId || undefined,
    functionName: "pieceCount",
    query: { enabled },
  });

  const { data: quorum } = useReadContract({
    abi: cultureIndexAbi,
    address: contractAddress || undefined,
    chainId: chainId || undefined,
    functionName: "quorumVotesForPiece",
    args: [pieceId],
    query: { enabled },
  });

  useEffect(() => {
    if (!votesWeight) return;
    getPosition(Number(votesWeight), contractAddress || "").then(setPosition);
  }, [votesWeight, contractAddress]);

  return {
    position,
    votesWeight,
    pieceCount: pieceCount ? Number(pieceCount) : null,
    quorum: quorum ? Number(quorum) : null,
    refetch: () => {
      refetch();
      refetchCount();
    },
  };
}
