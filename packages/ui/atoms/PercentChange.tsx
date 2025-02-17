"use client";

import classNames from "classnames";
import { useMemo } from "react";
import SvgArrowDown from "../icons/ArrowDown";
import SvgArrowUp from "../icons/ArrowUp";
import SvgMinus from "../icons/Minus";

interface Props {
  value: number;
  size?: "sm" | "md" | "lg";
  suffix?: string;
}

export const PercentChange = (props: Props) => {
  const { value, size, suffix } = props;
  const iconClass = useMemo(() => {
    switch (size) {
      case "sm":
        return "w-3 h-3 ml-0.5";
      case "md":
        return "w-4 h-4 ml-1";
      case "lg":
        return "w-5 h-5 ml-1.5";
      default:
        return "w-3 h-3 ml-0.5";
    }
  }, [size]);

  if (value === undefined || Number.isNaN(value)) return null;

  return (
    <span
      className={classNames("inline-flex items-center font-semibold", {
        "text-xs": size === "sm",
        "text-sm": size === "md",
        "text-lg": size === "lg",
        "text-green-500 dark:text-green-400": value > 0,
        "text-red-500 dark:text-red-400": value < 0,
        "text-zinc-500 dark:text-zinc-100": value === 0,
      })}
    >
      {Intl.NumberFormat("en", {
        notation: "standard",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        style: "percent",
      })
        .format(value)
        .replace(/^-/, "")}
      {suffix && ` (${suffix})`}

      {value > 0 && <SvgArrowUp className={iconClass} data-testid="positive" />}
      {value < 0 && <SvgArrowDown className={iconClass} data-testid="negative" />}
      {value === 0 && <SvgMinus className={iconClass} data-testid="neutral" />}
    </span>
  );
};
