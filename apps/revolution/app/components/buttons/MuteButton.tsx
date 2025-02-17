"use client";

import Volume2 from "@cobuild/ui/pixel-icons/Volume2";
import VolumeX from "@cobuild/ui/pixel-icons/VolumeX";
import { useLocalStorage } from "@cobuild/libs/hooks/useLocalStorage";
import { useEffect, useState } from "react";

const icons = {
  muted: VolumeX,
  unmuted: Volume2,
} as const;

type IconType = keyof typeof icons;

export const MuteButton = () => {
  const { muted, toggleMute } = useIsMuted();
  const [icon, setIcon] = useState<IconType>("muted");

  useEffect(() => {
    setIcon(muted ? "muted" : "unmuted");
  }, [muted]);

  const Icon = icons[icon];

  return (
    <button
      className="hover:text-lead-100 flex w-[30px] items-center justify-center text-white outline-none"
      onClick={toggleMute}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
};

export const useIsMuted = () => {
  const [muted, setIsMuted] = useLocalStorage(`muted`, false);

  return {
    muted,
    toggleMute: () => setIsMuted(c => !c),
    mute: () => setIsMuted(true),
    unmute: () => setIsMuted(false),
  };
};
