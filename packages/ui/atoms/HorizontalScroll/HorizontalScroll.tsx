"use client";

import classNames from "classnames";
import { useBrowserLayoutEffect } from "@cobuild/libs/hooks/useLayoutEffect";
import { Children, ReactNode, useCallback, useRef, useState } from "react";
import ChevronLeft from "../../pixel-icons/ChevronLeft";
import ChevronRight from "../../pixel-icons/ChevronRight";
import styles from "./HorizontalScroll.module.css";

interface IHorizontalScrollProps {
  className?: string;
  showArrows?: boolean;
  children?: ReactNode;
  snap?: "mandatory" | "proximity";
}

export const HorizontalScroll = (props: IHorizontalScrollProps) => {
  const { className = "", children, showArrows = false, snap = "mandatory" } = props;
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(150);
  const ref = useRef<HTMLDivElement>(null);

  useBrowserLayoutEffect(() => {
    if (!ref.current) return;
    const { clientWidth, scrollWidth } = ref.current;
    setCanScrollRight(scrollPosition + clientWidth < scrollWidth);
    setScrollOffset(2 * (scrollWidth / Children.count(children)));
  });

  const scroll = useCallback(
    (direction: 1 | -1) => {
      ref.current?.scrollBy({ left: direction * scrollOffset, behavior: "smooth" });
    },
    [scrollOffset],
  );

  return (
    <div className={classNames("relative", { "overflow-x-auto": !showArrows })}>
      {showArrows && scrollPosition > 0 && (
        <button className={`${styles.arrow} left-2`} onClick={() => scroll(-1)}>
          <ChevronLeft width="12" height="12" />
        </button>
      )}
      <div
        className={classNames(
          "hide-scrollbar flex max-w-[100vw] snap-x overflow-x-auto overflow-y-visible",
          className,
          {
            "snap-mandatory": snap === "mandatory",
            "snap-proximity": snap === "proximity",
          },
        )}
        ref={ref}
        onScroll={
          showArrows ? e => setScrollPosition((e.target as HTMLDivElement).scrollLeft) : undefined
        }
      >
        {children}
      </div>
      {showArrows && canScrollRight && (
        <button className={`${styles.arrow} right-2`} onClick={() => scroll(1)}>
          <ChevronRight width="12" height="12" />
        </button>
      )}
    </div>
  );
};

export default HorizontalScroll;
