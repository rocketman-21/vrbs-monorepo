import "server-only";

import { shortenUsername } from "@cobuild/libs/utils/account";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { UserProfile } from "app/components/user-profile/UserProfile";
import clsx from "classnames";
import Link from "next/link";
import { formatEther } from "viem";
import { AuctionDetailItem } from "./AuctionDetailItem";
import { getAuction } from "./getAuction";

interface Props {
  revolutionId: string;
  tokenId: string;
}

export const AuctionDetailsFinished = async (props: Props) => {
  const { revolutionId, tokenId } = props;

  const auction = await getAuction(revolutionId, tokenId);
  if (!auction) return null;

  if (auction.wasBurned) {
    return <AuctionDetailItem title="Outcome">{auction.tokenName} burned</AuctionDetailItem>;
  }

  const { winningBid, winner } = auction;

  return (
    <>
      <AuctionDetailItem title="Winning bid" className="text-lead-600 dark:text-lead-400">
        <span className="mr-1.5">Ξ</span>
        {winningBid ? formatEther(BigInt(winningBid)) : 0}
      </AuctionDetailItem>
      {winner && (
        <AuctionDetailItem title="Won by">
          <UserProfile address={winner as `0x${string}`} revolutionId={revolutionId} withPopover>
            {({ username, profilePicture }) => (
              <Link
                href={`/${revolutionId}/users/${username}`}
                className="hover:text-lead-500 inline-flex items-center space-x-1.5 text-zinc-800 dark:text-zinc-100"
              >
                <div className="h-6 w-6 md:h-8 md:w-8">
                  <Avatar id={winner} imageUrl={profilePicture} size={32} />
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
