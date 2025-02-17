import { vrgdacAbi } from "@cobuild/revolution";
import { unstable_cache } from "next/cache";
import { getContract } from "viem";
import { getClient } from "../web3/viem/clients";

export interface VrgdaData {
  targetPrice: number;
  perTimeUnit: number;
  decayConstant: number;
  priceDecayPercent: number;
  maxXBound: number;
}

// function to pull all the data from the contract
export const getVrgdaData = unstable_cache(
  async (contract: `0x${string}`, chainId: number) => {
    return await vrgdaData(contract, chainId);
  },
  undefined,
  { revalidate: 2592000, tags: ["vrgda-data"] },
);

const vrgdaData = async (contractAddress: `0x${string}`, chainId: number): Promise<VrgdaData> => {
  const contract = getContract({
    address: contractAddress,
    abi: vrgdacAbi,
    client: { public: getClient(chainId) },
  });

  return {
    targetPrice: Number(await contract.read.targetPrice()),
    perTimeUnit: Number(await contract.read.perTimeUnit()),
    decayConstant: Number(await contract.read.decayConstant()),
    priceDecayPercent: Number(await contract.read.priceDecayPercent()),
    maxXBound: Number(await contract.read.maxXBound()),
  };
};
