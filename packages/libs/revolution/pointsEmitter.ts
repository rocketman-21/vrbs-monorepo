import { getContract } from "viem";
import { getClient } from "../web3/viem/clients";
import { unstable_cache } from "next/cache";
import { revolutionPointsEmitterAbi } from "@cobuild/revolution";
import { cacheResult } from "../cache";

export interface PointsEmitterData {
  founderAddress: `0x${string}`;
  founderRateBps: number;
  founderEntropyRateBps: number;
  grantsAddress: `0x${string}`;
  grantsRateBps: number;
  startTime: Date;
}

// function to pull all the data from the contract
export const getPointsEmitterData = unstable_cache(
  async (contract: `0x${string}`, chainId: number) => {
    return await pointsEmitterData(contract, chainId);
  },
  undefined,
  { revalidate: 180, tags: ["points-emitter-data"] },
);

const pointsEmitterData = async (
  address: `0x${string}`,
  chainId: number,
): Promise<PointsEmitterData> => {
  const contract = getContract({
    address,
    abi: revolutionPointsEmitterAbi,
    client: { public: getClient(chainId) },
  });

  const [founderRateBps, founderEntropyRateBps, founderAddress] = await Promise.all([
    cacheResult(`founderRateBps_${contract.address}`, 2592000, async () =>
      Number(await contract.read.founderRateBps()),
    ),
    cacheResult(`founderEntropyRateBps_${contract.address}`, 2592000, async () =>
      Number(await contract.read.founderEntropyRateBps()),
    ),
    cacheResult(
      `founderAddress_${contract.address}`,
      2592000,
      async () => await contract.read.founderAddress(),
    ),
  ]);

  const [grantsRateBps, grantsAddress, startTime] = await Promise.all([
    cacheResult(`grantsRateBps_${contract.address}`, 86400, async () =>
      Number(await contract.read.grantsRateBps()),
    ),
    cacheResult(`grantsAddress_${contract.address}`, 86400, async () =>
      contract.read.grantsAddress(),
    ),
    cacheResult(`startTime_${contract.address}`, 2592000, async () =>
      Number(await contract.read.startTime()),
    ),
  ]);

  return {
    founderRateBps: Number(founderRateBps),
    founderEntropyRateBps: Number(founderEntropyRateBps),
    founderAddress,
    grantsAddress,
    grantsRateBps: Number(grantsRateBps),
    startTime: new Date(Number(startTime) * 1000),
  };
};
