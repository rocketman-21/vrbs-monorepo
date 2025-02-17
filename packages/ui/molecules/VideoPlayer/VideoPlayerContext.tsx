"use client";
import { PropsWithChildren, createContext, useContext, useState } from "react";

export interface IVideoPlayerContext {
  play: (video: HTMLVideoElement | null) => void;
  pause: (video: HTMLVideoElement | null) => void;
}

export const VideoPlayerContext = createContext<IVideoPlayerContext | undefined>(undefined);
VideoPlayerContext.displayName = "VideoPlayerContext";

export const VideoPlayerProvider = (props: PropsWithChildren) => {
  const [playingVideo, setPlayingVideo] = useState<HTMLVideoElement | null>();

  const play = (video: HTMLVideoElement | null) => {
    if (!video || !video.paused) return;
    if (playingVideo && playingVideo.src !== video.src) playingVideo.pause();

    video
      .play()
      .then(() => setPlayingVideo(video))
      .catch(e => {
        setPlayingVideo(null);
        if (e.name !== "NotAllowedError") console.error(e);
      });
  };

  const pause = (video: HTMLVideoElement | null) => {
    if (!video || video.paused) return;
    video.pause();
    setPlayingVideo(null);
  };

  return (
    <VideoPlayerContext.Provider value={{ play, pause }}>
      {props.children}
    </VideoPlayerContext.Provider>
  );
};

export const useVideoPlayer = () => {
  const context = useContext(VideoPlayerContext);
  if (!context) {
    throw new Error("useVideoPlayer must be used within a VideoPlayerProvider");
  }
  return context;
};
