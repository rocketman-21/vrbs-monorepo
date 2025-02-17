"use client";

import Tippy, { TippyProps } from "@tippyjs/react/headless";
import clsx from "classnames";
import { PropsWithChildren, ReactNode } from "react";
import styles from "./Tooltip.module.css";

export interface TooltipProps {
  className?: string;
  title?: string | null;
  subtitle?: string | null | ReactNode;
  position?: TippyProps["placement"];
  interactive?: boolean;
}

export const Tooltip = (props: PropsWithChildren<TooltipProps>) => {
  const {
    children,
    title,
    subtitle,
    className = "inline-block",
    position = "top",
    interactive = true,
  } = props;

  if (!title && !subtitle) return <>{children}</>;

  return (
    <Tippy
      appendTo={() => document.body}
      interactive={interactive}
      placement={position}
      render={attrs => (
        <div className={`${styles.tooltip} bg-zinc-800 dark:bg-zinc-950`} tabIndex={-1} {...attrs}>
          {title && (
            <div className="whitespace-normal text-pretty text-sm font-medium">{title}</div>
          )}
          {subtitle && (
            <div
              className={clsx("whitespace-pre-line text-pretty text-xs", {
                "font-medium": !!title,
                "mt-0.5 text-white/75": !!title,
              })}
            >
              {subtitle}
            </div>
          )}
          <div data-popper-arrow className={`${styles.arrow} ${styles[attrs["data-placement"]]}`} />
        </div>
      )}
    >
      <div className={`${className}`}>{children}</div>
    </Tippy>
  );
};
