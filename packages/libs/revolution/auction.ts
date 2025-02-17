import { auctionHouseAbi } from "@cobuild/revolution";
import { unstable_cache } from "next/cache";
import { getContract } from "viem";
import { getClient } from "../web3/viem/clients";
import { cacheResult } from "../cache";

export interface AuctionData {
  creatorRateBPS: number;
  entropyRateBPS: number;
  timeBuffer: number;
  reservePrice: number;
  minBidIncrementPercentage: number;
  minCreatorRateBPS: number;
  duration: number;
  creatorPayment: {
    etherBPS: number;
    pointsBPS: number;
  };
  grantsRateBps: number;
  grantsAddress: `0x${string}`;
  owner: `0x${string}`;
}

// function to pull all the data from the contract
export const getAuctionData = unstable_cache(
  async (contract: `0x${string}`, chainId: number) => {
    return await auctionData(contract, chainId);
  },
  undefined,
  { revalidate: 600, tags: ["auction-data"] },
);

const auctionData = async (
  contractAddress: `0x${string}`,
  chainId: number,
): Promise<AuctionData> => {
  const contract = getContract({
    address: contractAddress,
    abi: auctionHouseAbi,
    client: { public: getClient(chainId) },
  });

  const [
    owner,
    timeBuffer,
    reservePrice,
    duration,
    minCreatorRateBPS,
    grantsAddress,
    minBidIncrementPercentage,
  ] = await Promise.all([
    cacheResult(`owner_${contract.address}`, 2592000, async () => contract.read.owner()),
    cacheResult(`timeBuffer_${contract.address}`, 2592000, async () =>
      Number(await contract.read.timeBuffer()),
    ),
    cacheResult(`reservePrice_${contract.address}`, 2592000, async () =>
      Number(await contract.read.reservePrice()),
    ),
    cacheResult(`duration_${contract.address}`, 604800, async () =>
      Number(await contract.read.duration()),
    ),
    cacheResult(`minCreatorRateBPS_${contract.address}`, 2592000, async () =>
      Number(await contract.read.minCreatorRateBps()),
    ),
    cacheResult(`grantsAddress_${contract.address}`, 604800, async () =>
      contract.read.grantsAddress(),
    ),
    cacheResult(`minBidIncrementPercentage_${contract.address}`, 604800, async () =>
      Number(await contract.read.minBidIncrementPercentage()),
    ),
  ]);

  const [creatorRateBPS, entropyRateBPS, grantsRateBps] = await Promise.all([
    cacheResult(`creatorRateBps_${contract.address}`, 3600, async () =>
      Number(await contract.read.creatorRateBps()),
    ),
    cacheResult(`entropyRateBps_${contract.address}`, 3600, async () =>
      Number(await contract.read.entropyRateBps()),
    ),
    cacheResult(`grantsRateBps_${contract.address}`, 3600, async () =>
      Number(await contract.read.grantsRateBps()),
    ),
  ]);

  return {
    creatorRateBPS: Number(creatorRateBPS),
    timeBuffer: Number(timeBuffer),
    owner: owner.toLowerCase() as `0x${string}`,
    reservePrice: Number(reservePrice),
    grantsRateBps: Number(grantsRateBps),
    grantsAddress: grantsAddress,
    minBidIncrementPercentage: Number(minBidIncrementPercentage),
    minCreatorRateBPS: Number(minCreatorRateBPS),
    duration: Number(duration),
    entropyRateBPS: Number(entropyRateBPS),
    creatorPayment: {
      etherBPS: Number((creatorRateBPS * entropyRateBPS) / 1e4),
      pointsBPS: Number((creatorRateBPS * (1e4 - entropyRateBPS)) / 1e4),
    },
  };
};
