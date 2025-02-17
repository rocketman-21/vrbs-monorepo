"use client";

import classNames from "classnames";
import { PropsWithChildren, ReactNode, useEffect, useRef } from "react";
import { HorizontalScroll } from "./HorizontalScroll/HorizontalScroll";

interface Props {
  size?: "xl" | "lg";
  className?: string;
}

export const HorizontalMenu = (props: PropsWithChildren<Props>) => {
  const { size = "xl", className = "", children } = props;

  return (
    <HorizontalScroll
      className={classNames(className, {
        "space-x-5 text-xl md:space-x-7": size === "xl",
        "space-x-4 text-lg md:space-x-6": size === "lg",
      })}
    >
      {children}
    </HorizontalScroll>
  );
};

interface ItemProps {
  children: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export const HorizontalMenuItem = (props: ItemProps) => {
  const { children, isActive = false, onClick = () => undefined } = props;
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!ref.current || !isActive) return;
    const container = ref.current.closest(".overflow-x-auto");
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const currentElementRect = ref.current.getBoundingClientRect();

    // Current element isn't visible
    if (currentElementRect.right > containerRect.width) {
      container.scrollTo({ left: currentElementRect.right - containerRect.width });
      return;
    }

    // Next element isn't visible
    const nextElementRect = ref.current.nextElementSibling?.getBoundingClientRect();
    if (nextElementRect && nextElementRect.right > containerRect.width) {
      container.scrollTo({ left: currentElementRect.left / 2 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <h3 ref={ref}>
      <button
        onClick={onClick}
        className={classNames(
          "whitespace-nowrap font-semibold outline-none duration-200 focus:outline-none",
          {
            "text-zinc-400 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-white": !isActive,
            "dark:text-white": isActive,
          },
        )}
      >
        {children}
      </button>
    </h3>
  );
};

HorizontalMenu.Item = HorizontalMenuItem;

export default HorizontalMenu;
