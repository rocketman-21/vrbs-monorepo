"use client";

import { canUseNextImage } from "@cobuild/libs/utils/image";
import { openseaNftUrl } from "@cobuild/libs/utils/url";
import HorizontalScroll from "@cobuild/ui/atoms/HorizontalScroll/HorizontalScroll";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { useRevolution } from "app/libs/useRevolution";
import Image from "next/image";

interface Props {
  nfts: { name: string; imageUrl: string; tokenId: string }[];
}

export const UserTokens = (props: Props) => {
  const { nfts } = props;
  const { addresses, chainId, config } = useRevolution();

  if (nfts.length === 0) {
    const placeholder = config.auctionPreLaunchPlaceholderImage;

    return (
      <div className="mt-4 flex items-center space-x-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            className="flex size-12 shrink-0 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700"
            key={i}
          >
            {placeholder && (
              <Image src={placeholder} width={48} height={48} alt="" className="opacity-30" />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <HorizontalScroll className="mt-4 space-x-1">
      {nfts
        .filter(nft => !!nft.imageUrl)
        .map(({ imageUrl, name, tokenId }) => (
          <a
            href={openseaNftUrl(addresses?.token || "", tokenId, chainId)}
            key={tokenId}
            target="_blank"
            className="size-12 shrink-0 flex"
          >
            <Tooltip subtitle={name}>
              <Image
                src={imageUrl}
                className="size-12 rounded-md duration-150 hover:opacity-80"
                width={48}
                height={48}
                alt={name}
                unoptimized={!canUseNextImage(imageUrl)}
              />
            </Tooltip>
          </a>
        ))}
    </HorizontalScroll>
  );
};
