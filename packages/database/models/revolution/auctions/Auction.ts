import "server-only";

import { Auction } from "prisma-database";
import { getAddress, zeroAddress } from "viem";
import { IAuction } from "./IAuction";

export function transformAuction(auction: Auction): IAuction {
  return Object.assign(auction, {
    isOver: new Date() > auction.details.endTime,
    wasBurned: auction.winner === zeroAddress,
    details: {
      ...auction.details,
      sellerAddress: auction.details.sellerAddress as `0x${string}` | null,
      fundsRecipient: auction.details.fundsRecipient as `0x${string}` | null,
    },
    hasBeenLaunched: true,
    nftContractAddress: getAddress(auction.nftContractAddress),
    auctionContractAddress: getAddress(auction.auctionContractAddress),
  });
}
