import "server-only";

import { getAuctionSplits } from "@cobuild/libs/web3/auction/auctionSplits";
import { AuctionSplitItem } from "./AuctionSplitItem";
import { getAuction } from "./getAuction";

interface Props {
  revolutionId: string;
  tokenId: string;
}

export const AuctionSplits = async (props: Props) => {
  const { tokenId, revolutionId } = props;

  const auction = await getAuction(revolutionId, tokenId);

  if (!auction.nftContractAddress) return null;

  const splits = await getAuctionSplits({
    amount: Number(auction.winningBid),
    creatorRateBps: auction.creatorRateBps || 0,
    entropyRateBps: auction.entropyRateBps || 0,
    tokenContract: auction.nftContractAddress,
    chainId: auction.chainId,
    tokenId,
    ethPaidToCreators: BigInt(auction.ethPaidToCreators || "0"),
    pointsPaidToCreators: BigInt(auction.pointsPaidToCreators || "0"),
  });

  return (
    <div className="flex flex-col items-start space-y-2.5">
      {splits.creators.map(creator => (
        <AuctionSplitItem
          wasBurned={auction.wasBurned}
          creatorRateBps={splits.creatorRateBps}
          entropyRateBps={splits.entropyRateBps}
          key={creator.address}
          {...creator}
          revolutionId={revolutionId}
        />
      ))}
    </div>
  );
};
