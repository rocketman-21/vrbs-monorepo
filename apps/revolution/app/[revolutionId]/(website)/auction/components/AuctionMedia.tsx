"use client";

import { canUseNextImage } from "@cobuild/libs/utils/image";
import { ITokenMetadata } from "@cobuild/libs/web3/token-metadata";
import { ConditionalWrapper } from "@cobuild/ui/atoms/ConditionalWrapper";
import Image from "next/image";
import Link from "next/link";
import { Submission } from "prisma-database";
import { AuctionImage } from "./AuctionImage";
import { AuctionVideo } from "./AuctionVideo";
import { useRevolution } from "app/libs/useRevolution";
import classNames from "classnames";

interface Props {
  metadata: ITokenMetadata | null;
  tokenId: string;
  url: string | null;
  submission: Submission | null;
}

export const AuctionMedia = (props: Props) => {
  const { metadata, tokenId, url, submission } = props;

  const hasImage = metadata && metadata?.image.length > 0;
  const hasAnimation = metadata && metadata.animation_url.length > 0;
  const { config } = useRevolution();
  const { creationOrientation = "square" } = config;

  return (
    <>
      {hasImage && (
        <Image
          src={metadata.image}
          alt=""
          width="720"
          height="720"
          className="pointer-events-none absolute inset-0 h-full w-full scale-[1.75] select-none object-cover object-center opacity-[0.125] blur-3xl dark:opacity-[0.09]"
          unoptimized={!canUseNextImage(metadata.image)}
        />
      )}
      <div
        className={classNames("relative w-full max-w-full overflow-hidden rounded-xl bg-zinc-300", {
          "aspect-w-16 aspect-h-9": creationOrientation === "horizontal",
          "aspect-w-9 aspect-h-16": creationOrientation === "vertical",
          "aspect-square": creationOrientation === "square",
        })}
      >
        {hasAnimation && (
          <AuctionVideo
            src={submission?.muxStreamUrl || metadata.animation_url}
            poster={submission?.thumbnailUrl || metadata.image}
          />
        )}
        {!hasAnimation && hasImage && (
          <ConditionalWrapper
            condition={!!url}
            wrapper={children => (
              <Link href={`${url}`} className="duration-100 hover:opacity-85">
                {children}
              </Link>
            )}
          >
            <AuctionImage src={metadata.image} alt={tokenId} />
          </ConditionalWrapper>
        )}
      </div>
    </>
  );
};
