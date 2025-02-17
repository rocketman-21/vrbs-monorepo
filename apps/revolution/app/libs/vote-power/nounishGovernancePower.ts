import "server-only";

import { getClient } from "@cobuild/libs/web3/viem/clients";
import { gnarsTokenAbi } from "@cobuild/libs/web3/wagmi";
import { unstable_cache } from "next/cache";
import { nounsTokenAbi } from "onchain-ingestion/web3/wagmi";
import { getContract } from "viem";

export const getNounishGovernancePower = unstable_cache(
  async (
    address: `0x${string}`,
    tokenContract: `0x${string}`,
    chainId: number,
    revolutionId: string,
  ) => {
    if (revolutionId === "thatsgnarly") {
      return getGnarsGovernancePower(address, tokenContract, chainId);
    }

    const contract = getContract({
      address: tokenContract,
      abi: nounsTokenAbi,
      client: { public: getClient(chainId) },
    });
    const balance = await contract.read.getCurrentVotes([address]);
    return balance.toString();
  },
  undefined,
  { revalidate: 10 },
);

async function getGnarsGovernancePower(
  address: `0x${string}`,
  tokenContract: `0x${string}`,
  chainId: number,
) {
  const contract = getContract({
    address: tokenContract,
    abi: gnarsTokenAbi,
    client: { public: getClient(chainId) },
  });

  const votes = await contract.read.getVotes([address]);

  return votes.toString();
}
