"use client";

import { useMedia } from "./useMedia";

export const useIsMobile = (): boolean => {
  return useMedia(`(max-width: 767px)`);
};

export const useIsDesktop = (): boolean => {
  return !useIsMobile();
};

export const useIsTouchDevice = () => {
  return useMedia(`(hover: none)`);
};

export function useIsiOS() {
  return (
    ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(
      navigator.platform,
    ) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
}
