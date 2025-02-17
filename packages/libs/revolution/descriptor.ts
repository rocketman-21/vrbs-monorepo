import { getContract } from "viem";
import { getClient } from "../web3/viem/clients";
import { unstable_cache } from "next/cache";
import { descriptorAbi } from "@cobuild/revolution";
import { cacheResult } from "../cache";

export interface DescriptorData {
  isDataURIEnabled: boolean;
  baseURI: string;
  tokenNamePrefix: string;
}

// function to pull all the data from the contract
export const getDescriptorData = unstable_cache(
  async (descriptor: `0x${string}`, chainId: number) => {
    return await descriptorData(descriptor, chainId);
  },
  undefined,
  { revalidate: 180, tags: ["descriptor-data"] },
);

const descriptorData = async (
  cultureIndex: `0x${string}`,
  chainId: number,
): Promise<DescriptorData> => {
  const contract = getContract({
    address: cultureIndex,
    abi: descriptorAbi,
    client: { public: getClient(chainId) },
  });

  const [isDataURIEnabled, baseURI, tokenNamePrefix] = await Promise.all([
    cacheResult(`isDataURIEnabled_${contract.address}`, 2592000, async () =>
      contract.read.isDataURIEnabled(),
    ),
    cacheResult(`baseURI_${contract.address}`, 2592000, async () => contract.read.baseURI()),
    cacheResult(`tokenNamePrefix_${contract.address}`, 2592000, async () =>
      contract.read.tokenNamePrefix(),
    ),
  ]);

  return {
    isDataURIEnabled,
    baseURI,
    tokenNamePrefix,
  };
};
