import { unstable_cache } from "next/cache";
import { getAddress, getContract } from "viem";
import { getClient } from "../viem/clients";
import { zoraCreator1155Abi } from "../wagmi";

export const getDropCurrentTokenId = unstable_cache(
  async (address: `0x${string}`, chainId: number): Promise<string | null> => {
    try {
      const contract = getContract({
        address: getAddress(address),
        abi: zoraCreator1155Abi,
        client: { public: getClient(chainId) },
      });

      const info = await contract.read.nextTokenId();
      return (Number(info) - 1).toString();
    } catch (e) {
      console.error(e);
      return null;
    }
  },
  undefined,
  { revalidate: 60, tags: ["drop"] },
);
