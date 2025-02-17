"use client";

import { revolutionVotingPowerAbi } from "@cobuild/revolution";
import { CultureIndexVersion } from "prisma-database";
import { getAddress } from "viem/utils";
import { useAccount, useReadContract } from "wagmi";
import { getCultureIndexAbi } from "./cultureIndexAbi";

type Args = {
  pieceId: string;
  chainId: number;
  contractAddress: `0x${string}`;
  logicContractVersion: CultureIndexVersion;
  enabled?: boolean;
  votingPowerContract?: `0x${string}`;
};

export function useVotingPowerForPiece(args: Args) {
  const { pieceId, chainId, contractAddress, logicContractVersion, votingPowerContract, enabled } =
    args;
  const { address } = useAccount();

  const abi = getCultureIndexAbi(logicContractVersion);

  const { data, isLoading, isSuccess } = useReadContract({
    abi,
    address: getAddress(contractAddress),
    chainId,
    functionName: "getAccountVotingPowerForPiece",
    args: address ? [BigInt(pieceId), address] : undefined,
    query: { enabled },
  });

  const { data: pointsPower } = useReadContract({
    abi: revolutionVotingPowerAbi,
    address: votingPowerContract ? getAddress(votingPowerContract) : undefined,
    chainId,
    functionName: "getPointsVotes",
    args: address ? [address] : undefined,
    query: { enabled },
  });

  const { data: tokenPower } = useReadContract({
    abi: revolutionVotingPowerAbi,
    address: votingPowerContract ? getAddress(votingPowerContract) : undefined,
    chainId,
    functionName: "getTokenVotes",
    args: address ? [address] : undefined,
    query: { enabled },
  });

  return {
    votingPower: data || BigInt(0),
    pointsPower: pointsPower || BigInt(0),
    tokenPower: tokenPower || BigInt(0),
    totalVotingPower: (pointsPower || BigInt(0)) + (tokenPower || BigInt(0)),
    isLoading,
    isSuccess,
  };
}
