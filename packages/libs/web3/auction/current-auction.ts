import { auctionHouseAbi } from "@cobuild/revolution";
import { cache } from "react";
import { getContract, zeroAddress } from "viem";
import { getClient } from "../viem/clients";

export const getCurrentAuction = cache(async (address: `0x${string}`, chainId: number) => {
  const contract = getContract({
    address,
    abi: auctionHouseAbi,
    client: { public: getClient(chainId) },
  });
  const currentAuction = await contract.read.auction();

  const tokenId = currentAuction?.[0];
  const amount = Number(currentAuction?.[1]);
  const startTime = Number(currentAuction?.[2]);
  const endTime = Number(currentAuction?.[3]);
  const bidder = currentAuction?.[4];
  const referral = currentAuction?.[5];
  const settled = currentAuction?.[6];

  const isOver = startTime > 0 && Date.now() > Number(endTime) * 1e3;
  const wasBurned = isOver && bidder === zeroAddress;

  const hasBeenLaunched = tokenId > 0 || (startTime > 0 && !(await contract.read.paused()));

  return {
    tokenId: tokenId.toString(),
    amount,
    startTime,
    endTime,
    bidder,
    referral,
    settled,
    hasBeenLaunched,
    isOver,
    wasBurned,
    chainId,
    contractAddress: address,
  };
});

export const isAuctionPaused = cache(async (address: `0x${string}`, chainId: number) => {
  const contract = getContract({
    address,
    abi: auctionHouseAbi,
    client: { public: getClient(chainId) },
  });
  return await contract.read.paused();
});
