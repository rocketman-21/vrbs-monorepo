import { Auction } from "prisma-database";

export interface IAuction extends Auction {
  isOver: boolean;
  wasBurned: boolean;
  details: {
    startTime: Date;
    endTime: Date;
    sellerAddress: `0x${string}` | null;
    fundsRecipient: `0x${string}` | null;
  };
  hasBeenLaunched: boolean;
  nftContractAddress: `0x${string}`;
  auctionContractAddress: `0x${string}`;
}
