import { getContract } from "viem";
import { getClient } from "../web3/viem/clients";
import { unstable_cache } from "next/cache";
import { revolutionVotingPowerAbi } from "@cobuild/revolution";

export interface VotingPowerData {
  pointsVoteWeight: number;
  tokenVoteWeight: number;
}

// function to pull all the data from the contract
export const getVotingPowerData = unstable_cache(
  async (contract: `0x${string}`, chainId: number) => {
    return await votingPowerData(contract, chainId);
  },
  undefined,
  { revalidate: 2592000, tags: ["voting-power-data"] },
);

const votingPowerData = async (
  address: `0x${string}`,
  chainId: number,
): Promise<VotingPowerData> => {
  const contract = getContract({
    address,
    abi: revolutionVotingPowerAbi,
    client: { public: getClient(chainId) },
  });

  return {
    pointsVoteWeight: Number(await contract.read.pointsVoteWeight()),
    tokenVoteWeight: Number(await contract.read.tokenVoteWeight()),
  };
};
