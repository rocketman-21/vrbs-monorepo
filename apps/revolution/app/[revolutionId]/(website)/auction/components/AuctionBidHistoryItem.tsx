import "server-only";

import { etherscanNetworkUrl } from "@cobuild/libs/utils/url";
import { shortenIfEthAddress } from "@cobuild/libs/utils/account";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { DateLocal } from "@cobuild/ui/atoms/DateLocal";
import SvgExternalLink from "@cobuild/ui/pixel-icons/ExternalLink";
import { UserProfile } from "app/components/user-profile/UserProfile";
import Link from "next/link";
import { AuctionBid } from "prisma-database";
import { formatEther } from "viem";

interface Props {
  bid: AuctionBid;
  chainId: number;
  revolutionId: string;
}

export const AuctionBidHistoryItem = (props: Props) => {
  const { bid, chainId, revolutionId } = props;
  const { transactionHash, bidder, bidAmount, bidCreatedAt } = bid;

  return (
    <div key={transactionHash} className="group flex items-center justify-between space-x-2 py-3">
      <div className="flex items-center space-x-4">
        <UserProfile address={bidder as `0x${string}`} revolutionId={revolutionId} withPopover>
          {({ profilePicture, username, displayUsername }) => (
            <Link
              href={`/${revolutionId}/users/${username}`}
              className="hover:text-lead-600 inline-flex items-center space-x-1.5"
            >
              <Avatar id={bidder} imageUrl={profilePicture} size={24} className="size-6" />
              <h5>{displayUsername}</h5>
            </Link>
          )}
        </UserProfile>
        <DateLocal
          dateTime={bidCreatedAt}
          options={{ hour: "numeric", minute: "numeric", second: "numeric" }}
          className="text-xs text-zinc-400"
        />
      </div>
      <div className="flex items-center space-x-1.5">
        <strong className="font-medium text-zinc-800">
          <span className="mr-1">Ξ</span>
          {formatEther(BigInt(bidAmount))}
        </strong>
        <a
          href={etherscanNetworkUrl(transactionHash, chainId)}
          target="_blank"
          className="opacity-50 duration-150 hover:opacity-100"
        >
          <SvgExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};
