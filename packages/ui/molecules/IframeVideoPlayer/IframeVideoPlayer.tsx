"use client";

import { AspectRatioTypeEnum, getAspectRatioClass } from "@cobuild/libs/media/AspectRatio";
import classNames from "classnames";
import { useState } from "react";
import Play from "../../pixel-icons/Play";
import { VideoThumbnail } from "./VideoThumbnail";

interface Props {
  embedUrl: string;
  autoplay?: boolean;
  thumbnailUrl?: string;
  color?: string;
  aspectRatio?: AspectRatioTypeEnum;
}

export const IframeVideoPlayer = (props: Props) => {
  const {
    embedUrl,
    autoplay,
    thumbnailUrl,
    color = "#000",
    aspectRatio = AspectRatioTypeEnum.Horizontal,
  } = props;
  const [showThumbnail, setShowThumbnail] = useState(autoplay === false);
  const hasThumbmail = !!thumbnailUrl;

  return (
    <div
      className={classNames(
        "group relative flex max-h-full w-full max-w-full justify-center overflow-hidden bg-black",
        getAspectRatioClass(aspectRatio),
      )}
    >
      {hasThumbmail && showThumbnail && (
        <>
          <VideoThumbnail
            width="960"
            height="540"
            alt="Video Thumbnail"
            className="h-full w-full"
            src={thumbnailUrl}
          />
          <button
            className="group absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 duration-300 hover:bg-opacity-25"
            onClick={() => setShowThumbnail(false)}
          >
            <span
              className="flex items-center justify-center rounded-md p-2.5 text-white duration-300 group-hover:scale-110"
              style={{ backgroundColor: color }}
            >
              <Play className="h-8 w-8" />
            </span>
          </button>
        </>
      )}

      {(!hasThumbmail || !showThumbnail) && (
        <iframe
          src={embedUrl}
          title="Video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      )}
    </div>
  );
};

export default IframeVideoPlayer;
