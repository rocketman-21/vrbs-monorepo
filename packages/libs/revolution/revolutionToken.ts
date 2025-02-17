import { revolutionTokenAbi } from "@cobuild/revolution";
import { unstable_cache } from "next/cache";
import { getContract } from "viem";
import { getClient } from "../web3/viem/clients";

export interface RevolutionTokenData {
  name: string;
  symbol: string;
  contractURI: string;
}

// function to pull all the data from the contract
//get proxy contracts for token
export const getRevolutionTokenData = unstable_cache(
  async (contract: `0x${string}`, chainId: number) => {
    return await revolutionTokenData(contract, chainId);
  },
  undefined,
  { revalidate: 2592000, tags: ["revolution-token-data"] },
);

const revolutionTokenData = async (
  address: `0x${string}`,
  chainId: number,
): Promise<RevolutionTokenData> => {
  const contract = getContract({
    address,
    abi: revolutionTokenAbi,
    client: { public: getClient(chainId) },
  });

  return {
    name: await contract.read.name(),
    symbol: await contract.read.symbol(),
    contractURI: await contract.read.contractURI(),
  };
};
