"use client";

import { useEffect, useState } from "react";
import { useBrowserLayoutEffect } from "./useLayoutEffect";
import { useIsMobile } from "./useIsScreenSize";

interface WindowSize {
  width: number;
  height: number; // current (dynamic) view height
  lvh: number; // largest view height (for mobile)
  svh: number; // smallest view height (for mobile)
}

export const useWindowSize = (): WindowSize => {
  const isMobile = useIsMobile();

  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
    lvh: 0,
    svh: 0,
  });

  const handleSize = () => {
    setWindowSize(({ lvh, svh }) => ({
      width: window.innerWidth,
      height: window.innerHeight,
      lvh: isMobile ? Math.max(lvh, window.innerHeight) : window.innerHeight,
      svh: isMobile || svh === 0 ? window.innerHeight : Math.min(svh, window.innerHeight),
    }));
  };

  useEffect(() => {
    window.addEventListener("resize", handleSize);
    return () => window.removeEventListener("resize", handleSize);
  }, []);

  useBrowserLayoutEffect(() => {
    handleSize();
  }, []);

  return windowSize;
}


