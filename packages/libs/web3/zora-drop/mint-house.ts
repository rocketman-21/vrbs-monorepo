import { unstable_cache } from "next/cache";
import { getAddress, getContract } from "viem";
import { getClient } from "../viem/clients";
import { mintHouseAbi } from "../wagmi";

export const getMintHouseInterval = unstable_cache(
  async (address: `0x${string}`, chainId: number): Promise<string | null> => {
    try {
      const contract = getContract({
        address: getAddress(address),
        abi: mintHouseAbi,
        client: { public: getClient(chainId) },
      });

      const interval = await contract.read.interval();
      return interval.toString();
    } catch (e) {
      console.error(e);
      return null;
    }
  },
  undefined,
  { revalidate: 720 },
);
