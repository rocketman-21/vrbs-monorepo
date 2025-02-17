import { database } from "@cobuild/database";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { unstable_cache } from "next/cache";
import { formatEther } from "viem";

export async function getAveragePointPrice(revolutionId: string) {
  const avgWinningBid = await getAverageAuctionWinningBid(revolutionId);
  return Number(formatEther(BigInt(avgWinningBid))) / 1000;
}

const getAverageAuctionWinningBid = unstable_cache(
  async (revolutionId: string): Promise<string> => {
    const revolution = await Revolutions().getById(revolutionId);
    if (!revolution || !revolution.addresses) return "";

    const bids = await database.auction.findMany({
      where: { auctionContractAddress: revolution.addresses.auction, winningBid: { not: null } },
      select: { winningBid: true },
    });

    const total = bids.reduce((acc, bid) => acc + BigInt(bid.winningBid || "0"), BigInt(0));

    return bids.length > 0 ? (total / BigInt(bids.length)).toString() : "0";
  },
  undefined,
  { revalidate: 3600, tags: ["auction"] },
);
