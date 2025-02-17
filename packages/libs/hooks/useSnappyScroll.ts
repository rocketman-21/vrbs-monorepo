"use client";

import { useCallback } from "react";
import { useBrowserLayoutEffect } from "./useLayoutEffect";

type ISnapType = "mandatory" | "proximity";

interface Props {
  auto?: boolean;
  type?: ISnapType;
}

export const useSnappyScroll = (props?: Props) => {
  const { auto = true, type = "mandatory" } = props || {};

  const snapTypeClass = type === "mandatory" ? "snap-mandatory" : "snap-proximity";

  const enable = useCallback(() => {
    document.querySelector("html")?.classList.add("snap-y", snapTypeClass);
  }, [snapTypeClass]);

  const disable = useCallback(() => {
    document.querySelector("html")?.classList.remove("snap-y", snapTypeClass);
  }, [snapTypeClass]);

  useBrowserLayoutEffect(() => {
    if (auto) enable();
    return () => {
      if (auto) disable();
    };
  }, []);

  return {
    enableSnappyScroll: enable,
    disableSnappyScroll: disable,
  };
};
