import { revolutionDaoLogicV1Abi } from "@cobuild/revolution";
import { unstable_cache } from "next/cache";
import { getContract } from "viem";
import { getClient } from "../web3/viem/clients";

export interface RevolutionDAOData {
  name: string;
  flag: string;
  purpose: string;
}

export const getRevolutionDAOData = unstable_cache(
  async (contract: `0x${string}`, chainId: number) => {
    return await revolutionDAOData(contract, chainId);
  },
  undefined,
  { revalidate: 604800, tags: ["dao-data"] },
);

const revolutionDAOData = async (
  contractAddress: `0x${string}`,
  chainId: number,
): Promise<RevolutionDAOData> => {
  const contract = getContract({
    address: contractAddress,
    abi: revolutionDaoLogicV1Abi,
    client: { public: getClient(chainId) },
  });

  return {
    name: await contract.read.name(),
    flag: await contract.read.flag(),
    purpose: await contract.read.purpose(),
  };
};
