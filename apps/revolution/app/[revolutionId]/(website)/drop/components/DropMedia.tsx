"use client";

import { ISubmission, Serialized } from "@cobuild/database/types";
import { canUseNextImage } from "@cobuild/libs/utils/image";
import { ITokenMetadata } from "@cobuild/libs/web3/token-metadata";
import VideoPlayer from "@cobuild/ui/molecules/VideoPlayer/VideoPlayer";
import { CreationContent } from "app/components/creations/CreationItem/CreationContent";
import { useRevolution } from "app/libs/useRevolution";
import classNames from "classnames";
import Image from "next/image";

interface Props {
  metadata: ITokenMetadata | null;
  submission: Serialized<ISubmission> | null;
}

export const DropMedia = (props: Props) => {
  const { metadata, submission } = props;

  const hasImage = metadata && metadata?.image.length > 0;
  const hasAnimation = metadata && metadata?.animation_url.length > 0;
  const { revolutionId } = useRevolution();

  const { width, height } = submission || {};
  const { isHorizontal, isVertical, isSquare } = submission?.layout || {};

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
        className={classNames(
          "relative z-[5] inline-flex min-w-[320px] max-w-full flex-col overflow-hidden rounded-lg bg-black duration-300 max-sm:w-full md:ease-out",
          {
            "md:min-w-[560px]": isHorizontal || isSquare,
          },
        )}
        style={{
          aspectRatio: `${width} / ${height}`,
          // width: isHorizontal ? width : undefined,
          // height: isVertical ? height : undefined,
        }}
      >
        {submission && (
          <CreationContent
            mediaType={submission.mediaMetadata?.type || "video"}
            name={submission.name}
            play
            url={submission.url}
            videoUrl={submission.videoUrl}
            streamUrl={submission.streamUrl}
            className={classNames({ "lg:min-h-[520px]": isVertical })}
            thumbnail={submission.thumbnailUrl}
            creationUrl={`/${revolutionId}/creations/${submission.slug}`}
            objectFit={isVertical ? "cover" : "contain"}
          />
        )}

        {!submission && hasAnimation && (
          <VideoPlayer src={metadata.animation_url} poster={metadata.image} />
        )}
        {!submission && !hasAnimation && hasImage && (
          <Image
            alt={metadata.name}
            src={metadata.image}
            className="h-full w-full object-cover"
            height="720"
            width="720"
            priority
            unoptimized={!canUseNextImage(metadata.image)}
          />
        )}
      </div>
    </>
  );
};
