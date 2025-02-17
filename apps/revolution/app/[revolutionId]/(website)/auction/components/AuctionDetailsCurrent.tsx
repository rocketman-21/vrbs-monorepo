import "server-only";

import { shortenUsername } from "@cobuild/libs/utils/account";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { Countdown } from "app/components/Countdown";
import { UserProfile } from "app/components/user-profile/UserProfile";
import clsx from "classnames";
import Link from "next/link";
import { formatEther } from "viem";
import { AuctionDetailItem } from "./AuctionDetailItem";
import { AuctionRevalidate } from "./AuctionRevalidate";
import { getAuction } from "./getAuction";

interface Props {
  revolutionId: string;
  tokenId: string;
}

export const AuctionDetailsCurrent = async (props: Props) => {
  const { revolutionId, tokenId } = props;

  const auction = await getAuction(revolutionId, tokenId);
  if (!auction) return null;

  const { wasBurned, chainId, isOver, details, winningBid, tokenName, highestBidder } = auction;

  if (wasBurned) {
    return <AuctionDetailItem title="Outcome">{tokenName} burned</AuctionDetailItem>;
  }

  return (
    <>
      <AuctionRevalidate
        isOver={auction.isOver}
        hasBeenLaunched={auction.hasBeenLaunched}
        address={auction.auctionContractAddress}
        chainId={chainId}
      />

      <AuctionDetailItem title={`${isOver ? "Winning" : "Current"} bid`}>
        <span className="mr-1.5">Ξ</span>
        {winningBid ? formatEther(BigInt(winningBid)) : 0}
      </AuctionDetailItem>

      {!isOver && (
        <AuctionDetailItem title="Auction ends in">
          <Countdown targetTime={details.endTime.toISOString()} className="text-2xl md:text-3xl" />
        </AuctionDetailItem>
      )}

      {isOver && highestBidder && (
        <AuctionDetailItem title="Won by">
          <UserProfile address={highestBidder} revolutionId={revolutionId} withPopover>
            {({ username, profilePicture }) => (
              <Link
                href={`/${revolutionId}/users/${username}`}
                className="hover:text-lead-500 inline-flex items-center space-x-1.5 text-zinc-800"
              >
                <div className="h-6 w-6 md:h-8 md:w-8">
                  <Avatar id={username} imageUrl={profilePicture} size={32} />
                </div>
                <span className={clsx({ "text-sm md:text-2xl": username.length > 12 })}>
                  {shortenUsername(username, 16)}
                </span>
              </Link>
            )}
          </UserProfile>
        </AuctionDetailItem>
      )}
    </>
  );
};
