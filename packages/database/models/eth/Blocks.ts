import { getClient, getClientWithInfuraKey } from "@cobuild/libs/web3/viem/clients";
import { cache } from "react";
import { unstable_cache } from "next/cache";

export const getLatestBlockNumber = cache(async (chainId: number): Promise<number> => {
  const client = getClient(chainId);

  const fullBlock = await client.getBlock({ blockTag: "latest" });

  if (!fullBlock) {
    throw new Error("Could not fetch latest block");
  }

  return Number(fullBlock.number);
});

const getBlockTimestamp = async (
  blockNumber: bigint | number,
  chainId: number,
  infuraKey?: string,
): Promise<Date> => {
  if (process.env.NODE_ENV === "production") {
    const block = unstable_cache(
      async () => {
        return await getBlockTimestampWithRetry(blockNumber, chainId, infuraKey);
      },
      [`${blockNumber}-${chainId}`],
      // cache for 12 days
      { revalidate: 3600 * 24 * 12, tags: [`block-timestamp-${chainId}`] },
    );

    return block();
  }

  return new Date(0);
};

// use infura client to pull block timestamp w/ up to 3 retries
const getBlockTimestampWithRetry = async (
  blockNumber: bigint | number,
  chainId: number,
  infuraKey?: string,
): Promise<Date> => {
  let retries = 0;
  let lastError: Error | undefined;

  //dont nuke our infura key in dev
  const client = getClientWithInfuraKey(chainId, infuraKey);

  while (retries < 3) {
    try {
      const block = await client.getBlock({ blockNumber: BigInt(blockNumber) });
      return new Date(Number(block.timestamp) * 1000) || new Date(0);
    } catch (error: any) {
      lastError = error;
      console.error(`Failed to get block timestamp for ${blockNumber} on chain ${chainId}`, error);
      //wait 300ms
      await new Promise(resolve => setTimeout(resolve, 300));
      retries++;
    }
  }

  throw lastError;
};

export function Blocks() {
  return {
    getLatestBlockNumber,
    getBlockTimestamp,
  };
}
