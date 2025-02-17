"use client";

import { CultureIndexVersion } from "prisma-database";
import { getAddress } from "viem/utils";
import { useReadContract } from "wagmi";
import { getCultureIndexAbi } from "../../web3/revolution/cultureIndexAbi";

export function useQuorumVotesForPiece(args: {
  pieceId: number | null;
  chainId: number;
  contractAddress: `0x${string}`;
  logicContractVersion: CultureIndexVersion;
  disabled?: boolean;
}) {
  const { pieceId, chainId, contractAddress, logicContractVersion } = args;

  const abi = getCultureIndexAbi(logicContractVersion);

  const { data: totalQuorumVotesNeeded, isLoading } = useReadContract({
    abi,
    address: getAddress(contractAddress),
    chainId,
    functionName: "quorumVotesForPiece",
    args: pieceId ? [BigInt(pieceId)] : undefined,
    query: { enabled: !!pieceId && !args.disabled },
  });

  const { data: votes, isLoading: isLoadingVotes } = useReadContract({
    abi,
    address: getAddress(contractAddress),
    chainId,
    functionName: "totalVoteWeights",
    args: pieceId ? [BigInt(pieceId)] : undefined,
    query: { enabled: !!pieceId && !args.disabled },
  });

  return {
    totalQuorumVotesNeeded: totalQuorumVotesNeeded ? Number(totalQuorumVotesNeeded) : undefined,
    isLoading,
    remainingVotesNeeded:
      !isLoadingVotes && !isLoading && totalQuorumVotesNeeded
        ? Number(totalQuorumVotesNeeded) - Number(votes)
        : undefined,
  };
}
