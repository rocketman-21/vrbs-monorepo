"use client";

import { useEffect, useMemo, useState } from "react";
import { useThrottledCallback } from "use-debounce";
import { usePrevious } from "./usePrevious";

type IScrollDirection = "up" | "down";

export const useScrollPosition = () => {
  const [y, setY] = useState(0);
  const previousY = usePrevious(y) || 0;

  const scrollHandler = useThrottledCallback(() => {
    if (document.body.dataset.scrollLock === "true") return; // Ignore change by scroll-lock
    setY(window.pageYOffset);
  }, 75);

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    setY(window.pageYOffset);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  const scrollDirection: IScrollDirection = useMemo(() => (y > previousY ? "down" : "up"), [y]);

  return { scrollPosition: y, scrollDirection };
};
