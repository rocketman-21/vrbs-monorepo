"use client";

import { Media } from "@cobuild/database/types";
import { canUseNextImage } from "@cobuild/libs/utils/image";
import { VideoPlayer } from "@cobuild/ui/molecules/VideoPlayer/VideoPlayer";
import clsx from "classnames";
import Image from "next/image";

type Props = {
  media: Media;
  fullWidth?: boolean;
  alt?: string;
};

export const MediaItem = (props: Props) => {
  const { alt = "Image", fullWidth, media } = props;

  const isVideoProcessing = media.type === "video" && !media.muxStreamUrl;

  if (media.type === "image") {
    return (
      <Image
        src={media.url}
        alt={alt}
        contentEditable={false}
        unoptimized={!canUseNextImage(media.url)}
        width={media.width || 640}
        height={media.height || 480}
        className={clsx("mx-auto flex max-w-full object-cover", {
          "h-auto w-full": fullWidth,
        })}
      />
    );
  }

  if (media.type === "video" && isVideoProcessing) {
    return (
      <div className="border-lead-500 dark:border-lead-200 flex h-full min-h-[240px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 pt-6 text-center md:px-8">
        Processing video. Please wait...
      </div>
    );
  }

  if (media.type === "video" && media.muxStreamUrl) {
    return (
      <VideoPlayer
        src={media.muxStreamUrl}
        poster={media.thumbnailUrl}
        width={media.width}
        height={media.height}
        className={clsx("max-h-[80vh]", { "!w-full": fullWidth })}
        controls
      />
    );
  }

  return null;
};
