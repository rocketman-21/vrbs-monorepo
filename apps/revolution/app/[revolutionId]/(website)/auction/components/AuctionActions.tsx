import { isAuctionPaused } from "@cobuild/libs/web3/auction/current-auction";
import { AuctionBidForm } from "./AuctionBidForm";
import { AuctionSettleButton } from "./AuctionSettleButton";
import { getAuction } from "./getAuction";

interface Props {
  revolutionId: string;
  tokenId: string;
}

export const AuctionActions = async (props: Props) => {
  const { revolutionId, tokenId } = props;

  const auction = await getAuction(revolutionId, tokenId);
  if (!auction) return null;

  const { isOver } = auction;

  const isPaused = await isAuctionPaused(auction.auctionContractAddress, auction.chainId);

  return (
    <div className="border-lead-600 dark:border-lead-800 flex flex-col items-center space-y-2 border-t p-5">
      {isOver ? (
        <AuctionSettleButton isPaused={isPaused} />
      ) : (
        <AuctionBidForm amount={Number(auction.winningBid)} isPaused={isPaused} tokenId={tokenId} />
      )}
      {isPaused && (
        <p className="mt-2.5 text-sm opacity-70">The auction is paused, reach out to the owner.</p>
      )}
    </div>
  );
};
