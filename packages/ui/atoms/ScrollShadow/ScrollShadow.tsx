"use client";
import { useIsDesktop } from "@cobuild/libs/hooks/useIsScreenSize";
import cx from "classnames";
import { ReactNode, useEffect, useState } from "react";
import { useThrottledCallback } from "use-debounce";
import styles from "./ScrollShadow.module.css";

const SCROLL_GAP = 100;

interface ScrollShadowProps {
  children: ReactNode;
  className?: string;
  rounded?: boolean;
  hide?: boolean;
  size?: "sm" | "md";
}

export const ScrollShadow = ({
  children,
  className,
  rounded,
  size,
  hide = false,
}: ScrollShadowProps) => {
  const isDesktop = useIsDesktop();
  const [{ topScroll, bottomScroll }, setScroll] = useState({
    topScroll: false,
    bottomScroll: false,
  });
  const [isDesktopView, setIsDesktopView] = useState(false);

  useEffect(() => {
    setIsDesktopView(isDesktop);
  }, [isDesktop]);

  const onScroll = (event: any) => {
    const topScroll = event.target.scrollTop > SCROLL_GAP;
    const bottomScroll =
      event.target.scrollHeight - event.target.scrollTop < event.target.clientHeight + SCROLL_GAP;
    setScroll({ topScroll, bottomScroll });
  };
  const onScrollThrottled = useThrottledCallback(onScroll, 50);

  if (!isDesktopView) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className={cx("h-full", styles.scrollShadow)}>
        <div
          onScroll={onScrollThrottled}
          className={cx("hide-scrollbar h-full overflow-y-scroll", className)}
        >
          {children}
        </div>
        {!hide && (
          <div
            className={cx(styles.scrollShadowTop, {
              [styles.visible]: topScroll,
              [styles.sm]: size === "sm",
              "rounded-t-2xl": rounded,
            })}
          />
        )}
        {!hide && (
          <div
            className={cx(styles.scrollShadowBottom, {
              [styles.visible]: !bottomScroll,
              [styles.sm]: size === "sm",
              "rounded-b-2xl": rounded,
            })}
          />
        )}
      </div>
    </div>
  );
};

export default ScrollShadow;
