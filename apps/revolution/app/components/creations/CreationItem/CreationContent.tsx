"use client";

import { canUseNextImage } from "@cobuild/libs/utils/image";
import { ConditionalWrapper } from "@cobuild/ui/atoms/ConditionalWrapper";
import { EmptyState } from "@cobuild/ui/atoms/EmptyState/EmptyState";
import { VideoPlayer } from "@cobuild/ui/molecules/VideoPlayer/VideoPlayer";
import { useIsMuted } from "app/components/buttons/MuteButton";
import Image from "next/image";
import Link from "next/link";
import { CSSProperties } from "react";

interface Props {
  mediaType: string;
  name: string;
  videoUrl: string | null;
  streamUrl: string | null;
  isMuted?: boolean;
  url: string | null;
  play: boolean;
  thumbnail?: string | null;
  objectFit?: CSSProperties["objectFit"];
  className?: string;
  customControls?: boolean;
  creationUrl?: string;
  thumbnailOnly?: boolean;
}

export const CreationContent = (props: Props) => {
  const {
    mediaType,
    name,
    videoUrl,
    streamUrl,
    play = false,
    url,
    creationUrl,
    thumbnail,
    className = "",
    customControls,
    isMuted = false,
    thumbnailOnly = false,
    objectFit = "contain",
  } = props;
  const { muted } = useIsMuted();

  if (mediaType === "image") {
    return (
      <div className={`bg-page flex h-full w-full overflow-hidden ${className}`}>
        {url && (
          <ConditionalImage creationUrl={creationUrl} src={url} name={name} objectFit={objectFit} />
        )}
      </div>
    );
  }

  // if the videoUrl isn't raw video from ipfs adn there is no streamUrl, it's still uploading from workers
  if (!videoUrl || (!videoUrl?.includes("ipfs") && !streamUrl)) {
    return (
      <div className="flex min-h-[460px] min-w-full flex-col justify-center bg-zinc-800 object-cover text-white md:min-w-[500px] lg:min-h-[640px] dark:bg-black">
        <EmptyState text="Uploading clip..." illustration="researching">
          <div className="!mt-1.5 text-xs opacity-75">
            It will be available within the next few minutes
          </div>
        </EmptyState>
      </div>
    );
  }

  if (thumbnailOnly) {
    return (
      <div className={`bg-page flex h-full w-full overflow-hidden ${className}`}>
        {thumbnail && (
          <ConditionalImage
            creationUrl={creationUrl}
            src={thumbnail}
            name={name}
            objectFit={objectFit}
          />
        )}
      </div>
    );
  }

  return (
    <VideoPlayer
      src={streamUrl || videoUrl}
      autoPlay={play}
      muted={isMuted || muted}
      poster={thumbnail || undefined}
      objectFit={objectFit}
      customControls={customControls}
      className={className}
      withWrapper={false}
    />
  );
};

export const ConditionalImage = ({
  creationUrl,
  src,
  name,
  objectFit,
}: Partial<Props> & { src: string }) => (
  <ConditionalWrapper
    condition={!!creationUrl}
    wrapper={children => (
      <Link href={creationUrl || ""} className="grow">
        {children}
      </Link>
    )}
  >
    <Image
      src={src}
      alt={name || ""}
      width={1024}
      height={1024}
      className="h-full w-full"
      style={{ objectFit }}
      crossOrigin={src.includes("pinata.cloud") ? "anonymous" : undefined}
      unoptimized={!canUseNextImage(src)}
    />
  </ConditionalWrapper>
);
