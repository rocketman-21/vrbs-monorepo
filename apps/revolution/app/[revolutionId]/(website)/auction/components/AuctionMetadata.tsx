import "server-only";

import { Auctions } from "@cobuild/database/models/revolution/auctions/Auctions";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { getAuctionTokenMetadata } from "@cobuild/libs/web3/auction/token-metadata";
import Skeleton from "@cobuild/ui/atoms/Skeleton";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AuctionMedia } from "./AuctionMedia";
import { AuctionSplits } from "./AuctionSplits";
import classNames from "classnames";

interface Props {
  revolutionId: string;
  tokenId: string;
}

export const AuctionMetadata = async (props: Props) => {
  const { revolutionId, tokenId } = props;

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution || !revolution.addresses) notFound();

  const { addresses, chainId } = revolution;

  if (!addresses.token || !addresses.cultureIndex) return null;

  const metadata = await getAuctionTokenMetadata(addresses.token, chainId, tokenId);
  const submission = await Auctions().getSubmission(
    addresses.token,
    addresses.cultureIndex,
    chainId,
    tokenId,
  );

  const { config } = revolution;
  const { creationOrientation = "square" } = config;

  const url = submission ? `/${revolutionId}/creations/${submission.slug}` : null;

  return (
    <div
      className={classNames("flex flex-col space-y-4", {
        "m-auto max-w-[420px]": creationOrientation === "vertical",
      })}
    >
      <div>
        <AuctionMedia submission={submission} metadata={metadata} tokenId={tokenId} url={url} />
      </div>
      <Suspense fallback={<AuctionMetadataCreatorSkeletons />}>
        <div
          className={classNames(
            "max-w-full flex-col px-3 md:flex md:flex-row md:items-start md:justify-between md:space-x-6 md:space-y-0 lg:min-h-16",
            {
              "md:flex-col": creationOrientation === "vertical",
            },
          )}
        >
          <AuctionSplits revolutionId={revolutionId} tokenId={tokenId} />

          <span className="w-full whitespace-pre-line text-pretty text-sm text-zinc-700 md:w-auto md:max-w-[70%] md:pt-[4px] dark:text-zinc-400">
            {metadata?.description}
          </span>
        </div>
      </Suspense>
    </div>
  );
};

export const AuctionMetadataCreatorSkeletons = () => (
  <div className="lg:min-h-16">
    <div className="flex flex-col justify-start space-y-1 md:flex-row md:items-center md:justify-between">
      <Skeleton height={34} width={100} rounded />
      <Skeleton height={22} className="inline-block md:hidden" width={180} rounded />
      <Skeleton height={22} className="inline-block md:hidden" width={180} rounded />
      <Skeleton height={24} className="hidden md:inline-block" width={220} rounded />
    </div>
  </div>
);
