"use client";

import { AspectRatioTypeEnum, getAspectRatioClass } from "@cobuild/libs/media/AspectRatio";
import MuxVideo, { Props as MuxVideoProps } from "@mux/mux-video-react";
import { default as classNames, default as clsx } from "classnames";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { ConditionalWrapper } from "../../atoms/ConditionalWrapper";
import PlayIcon from "../../pixel-icons/Play";
import { VideoFullScreenButton } from "./VideoFullScreenButton";
import { useVideoPlayer } from "./VideoPlayerContext";
import { VideoProgress } from "./VideoProgress";

type Props = Omit<Partial<MuxVideoProps>, "autoplay" | "poster" | "width" | "height"> & {
  src?: string;
  autoPlay?: boolean;
  poster?: string | null;
  objectFit?: CSSProperties["objectFit"];
  customControls?: boolean;
  aspectRatio?: AspectRatioTypeEnum;
  width?: number | null;
  height?: number | null;
  className?: string;
  withWrapper?: boolean;
  withFullScreenButton?: boolean;
};

export const VideoPlayer = (props: Props) => {
  const {
    aspectRatio,
    className,
    width,
    height,
    src,
    autoPlay = false,
    objectFit = "cover",
    poster,
    preload = "metadata",
    controls,
    customControls = true,
    withFullScreenButton = false,
    muted,
    withWrapper = true,
    playbackId,
    ...rest
  } = props;

  const [status, setStatus] = useState<"playing" | "paused" | "waiting">("paused");
  const ref = useRef<HTMLVideoElement>(null);

  const { play, pause } = useVideoPlayer();

  const VideoComponent = useMemo(
    () => (src?.endsWith(".m3u8") || playbackId ? MuxVideo : "video"),
    [src, playbackId],
  );

  const aspectRatioClass = useMemo(
    () => (aspectRatio ? getAspectRatioClass(aspectRatio) : undefined),
    [aspectRatio],
  );

  useEffect(() => {
    if (!ref.current) return;
    ref.current.muted = muted || false;
  }, [muted]);

  useEffect(() => {
    if (autoPlay) play(ref.current);
    if (!autoPlay) pause(ref.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  return (
    <ConditionalWrapper
      condition={withWrapper}
      wrapper={children => (
        <div
          className={clsx(
            "group relative flex max-w-full justify-center overflow-hidden bg-black",
            className,
            aspectRatioClass,
            { "h-full w-full max-w-full": !width && !height },
          )}
          style={
            width && height
              ? {
                  aspectRatio: `${width} / ${height}`,
                  width: width >= height && width ? width : undefined,
                  height: width <= height && height ? height : undefined,
                }
              : undefined
          }
        >
          {children}
        </div>
      )}
    >
      <>
        <VideoComponent
          {...rest}
          playbackId={playbackId}
          ref={ref}
          src={src}
          autoPlay={false}
          crossOrigin="anonymous"
          playsInline
          className={classNames(`h-full w-full bg-black duration-100`, className, {
            "opacity-50": status === "waiting",
          })}
          preload={preload}
          poster={poster || undefined}
          style={{ objectFit }}
          controls={controls}
          onPause={() => setStatus("paused")}
          onPlay={() => setStatus("playing")}
          onPlaying={() => setStatus("playing")}
          onWaiting={() => setStatus("waiting")}
          onError={e => console.error(e.nativeEvent)}
        />
        {!controls && customControls && (
          <>
            <button
              className="group absolute inset-0 flex items-center justify-center"
              onClick={() => {
                if (!ref.current) return;
                ref.current.paused ? play(ref.current) : pause(ref.current);
              }}
            >
              {status === "waiting" && (
                <BeatLoader size={24} color="var(--color-lead-100)" speedMultiplier={0.7} />
              )}
              {status === "paused" && (
                <div className="group-hover:text-lead-200 flex items-center justify-center rounded-full bg-black/50 p-3 text-white backdrop-blur-lg duration-300 group-hover:scale-110">
                  <PlayIcon className="h-8 w-8" />
                </div>
              )}
            </button>
            {withFullScreenButton && <VideoFullScreenButton videoRef={ref} />}
            <VideoProgress videoRef={ref} />
          </>
        )}
      </>
    </ConditionalWrapper>
  );
};

export default VideoPlayer;
