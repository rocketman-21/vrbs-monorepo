"use client";

import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import VideoPlayer from "@cobuild/ui/molecules/VideoPlayer/VideoPlayer";
import clsx from "classnames";
import Image from "next/image";
import { usePostCreation } from "./PostCreationProvider";

interface Props {
  imageOpacity: number;
  setImageOpacity: (value: number) => void;
}

export const CreationThumbnail = ({ imageOpacity, setImageOpacity }: Props) => {
  const { values, cultureIndex } = usePostCreation();
  const { thumbnailUrl, mediaType, url, embedUrl } = values;

  const nogglesRequirement = cultureIndex.checklist.includes("⌐◨-◨ in the");

  if (mediaType === "video") {
    return <VideoPlayer controls src={url} />;
  }

  if (embedUrl) {
    return <iframe src={embedUrl} className="h-full w-full" />;
  }

  if (thumbnailUrl) {
    return (
      <div className="md:bg-card relative flex h-full w-full flex-col justify-center overflow-hidden md:px-4">
        <Image
          src={thumbnailUrl}
          width={288}
          height={288}
          alt=" "
          className="pointer-events-none absolute inset-0 h-full w-full scale-150 object-cover object-center opacity-40 blur-3xl max-sm:hidden"
        />
        <div className="relative rounded-lg border-2 border-white">
          <div className="absolute inset-0">
            <Image
              src="/images/vrbs/noggles.svg"
              alt="Noggles"
              width="32"
              height="32"
              className="h-full w-full object-cover"
            />
          </div>
          <Image
            src={thumbnailUrl}
            width={288}
            height={288}
            className="relative w-full rounded-lg object-contain"
            alt=" "
            crossOrigin="anonymous"
            style={{ opacity: imageOpacity / 100 }}
          />
        </div>
        {(cultureIndex.requiresSvg || nogglesRequirement) && (
          <>
            <div className="relative mt-2.5 flex items-center justify-between">
              {nogglesRequirement && (
                <Tooltip
                  title="Check ⌐◨-◨"
                  subtitle="Use slider to ensure noggles are in the right position."
                  className="flex items-center space-x-1.5 text-xs text-zinc-800"
                >
                  <span>0%</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    className="transparent accent-lead-500 h-0.5 w-16 cursor-pointer appearance-none rounded-lg border-transparent bg-black/50"
                    onChange={e => setImageOpacity(Number(e.target.value))}
                    value={imageOpacity}
                  />
                  <span>100%</span>
                </Tooltip>
              )}
              {cultureIndex.requiresSvg && (
                <FileSizeCheck size={thumbnailUrl.length} limit={31_000} />
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  return null;
};

const FileSizeCheck = (props: { size: number; limit: number }) => {
  const { size, limit } = props;

  const isOverLimit = size > limit;

  return (
    <Tooltip
      title={isOverLimit ? "File too large" : "File size is 👌"}
      subtitle={
        isOverLimit
          ? "Transaction may fail. We optimized your image with SVGO, but still it may be too large to store onchain."
          : undefined
      }
    >
      <dd className="flex shrink-0 items-center">
        <span className="mr-1.5 text-xs text-zinc-800">{(size / 1024).toFixed(2)} KB</span>
        <span
          className={clsx(
            "flex size-4 select-none items-center justify-center rounded-full p-0.5 text-xs",
            {
              "bg-red-500 text-white": isOverLimit,
              "bg-green-500 text-white": !isOverLimit,
            },
          )}
        >
          {isOverLimit && "!"}
          {!isOverLimit && "✓"}
        </span>
      </dd>
    </Tooltip>
  );
};
