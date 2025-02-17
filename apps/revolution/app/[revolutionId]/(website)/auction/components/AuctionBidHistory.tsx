import "server-only";

import { Auctions } from "@cobuild/database/models/revolution/auctions/Auctions";
import { Expandable } from "@cobuild/ui/molecules/Expandable/Expandable";
import { UserProfile } from "app/components/user-profile/UserProfile";
import { Suspense } from "react";
import { zeroAddress } from "viem";
import { AuctionBidHistoryItem } from "./AuctionBidHistoryItem";
import { getAuction } from "./getAuction";

interface Props {
  tokenId: string;
  revolutionId: string;
}

export const AuctionBidHistory = async (props: Props) => {
  const { tokenId, revolutionId } = props;

  const auction = await getAuction(revolutionId, tokenId);
  if (auction.wasBurned) return null;

  const { isOver, highestBidder, chainId } = auction;

  if (!auction.nftContractAddress) return null;

  const bidHistory = Auctions().getBidHistory(
    auction.auctionContractAddress,
    auction.nftContractAddress,
    chainId,
    tokenId,
  );

  return (
    <div className="text-center">
      <Expandable
        button={
          <span className="hover:text-lead-600 dark:hover:text-lead-400 text-sm font-medium">
            {!isOver && highestBidder && highestBidder !== zeroAddress && (
              <UserProfile address={highestBidder} revolutionId={revolutionId}>
                {user => <span>Highest bid by {user.displayUsername} </span>}
              </UserProfile>
            )}
            {isOver && (
              <>
                <span className="group-has-[.expanded]:hidden">Show</span>
                <span className="group-has-[.collapsed]:hidden">Hide</span>
                {` bids`}
              </>
            )}
          </span>
        }
      >
        <div className="mx-auto mt-4 max-w-lg divide-y divide-zinc-400">
          <Suspense>
            {(await bidHistory)
              .sort((a, b) => (BigInt(b.bidAmount) > BigInt(a.bidAmount) ? 1 : -1))
              .map(bid => (
                <AuctionBidHistoryItem
                  key={bid.transactionHash}
                  bid={bid}
                  chainId={chainId}
                  revolutionId={revolutionId}
                />
              ))}
          </Suspense>
        </div>
      </Expandable>
    </div>
  );
};
