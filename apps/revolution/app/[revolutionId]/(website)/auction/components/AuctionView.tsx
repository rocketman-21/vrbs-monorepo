import "server-only";

import Skeleton from "@cobuild/ui/atoms/Skeleton";
import { Suspense } from "react";
import { AuctionActions } from "./AuctionActions";
import { AuctionBidHistory } from "./AuctionBidHistory";
import { AuctionDetailsCurrent } from "./AuctionDetailsCurrent";
import { AuctionDetailsFinished } from "./AuctionDetailsFinished";
import { AuctionMetadata, AuctionMetadataCreatorSkeletons } from "./AuctionMetadata";
import { AuctionName } from "./AuctionName";
import { AuctionNavigation } from "./AuctionNavigation";
import { AuctionPreLaunch } from "./AuctionPreLaunch";
import { AuctionSpeech } from "./AuctionSpeech";
import { getAuction } from "./getAuction";

interface Props {
  revolutionId: string;
  tokenId: string;
}

export const AuctionView = async (props: Props) => {
  const { tokenId, revolutionId } = props;

  const auction = await getAuction(revolutionId, tokenId);

  if (!auction.hasBeenLaunched) {
    return <AuctionPreLaunch revolutionId={revolutionId} />;
  }

  return (
    <div className="relative mx-auto grid max-w-screen-xl gap-8 rounded-2xl px-4 lg:grid-cols-2 lg:px-6">
      <Suspense fallback={<AuctionMetadataSkeleton />}>
        <AuctionMetadata revolutionId={revolutionId} tokenId={tokenId} />
      </Suspense>

      <div className="group relative flex max-w-full flex-col justify-center overflow-hidden rounded-r-2xl lg:px-12 lg:pb-8">
        <AuctionNavigation tokenId={tokenId} revolutionId={revolutionId} />

        <div className="mt-4 text-center lg:mt-10">
          <AuctionName tokenName={auction.tokenName} tokenId={tokenId} />

          <div className="border-lead-600 dark:border-lead-800 mt-6 flex flex-col rounded-2xl border lg:mt-8">
            <div className="divide-lead-600 dark:divide-lead-800 flex divide-x">
              {!auction.isCurrent && (
                <AuctionDetailsFinished revolutionId={revolutionId} tokenId={tokenId} />
              )}
              {auction.isCurrent && (
                <AuctionDetailsCurrent revolutionId={revolutionId} tokenId={tokenId} />
              )}
            </div>

            {auction.isCurrent && <AuctionActions revolutionId={revolutionId} tokenId={tokenId} />}
            <AuctionSpeech tokenId={tokenId} revolutionId={revolutionId} />
          </div>

          <div className="mt-4 min-h-6">
            <Suspense>
              <AuctionBidHistory tokenId={tokenId} revolutionId={revolutionId} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuctionMetadataSkeleton = () => (
  <div className="flex flex-col space-y-4">
    <Skeleton className="aspect-square w-full rounded-xl" height="auto" />
    <AuctionMetadataCreatorSkeletons />
  </div>
);
