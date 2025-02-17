"use client";

import clx from "classnames";
import React, { MouseEventHandler } from "react";
import { Icon as IconType } from "../types";
import styles from "./Badge.module.css";

export interface BadgeProps {
  className?: string;
  itemClassName?: string;
  iconClassName?: string;
  iconSize?: number;
  children?: React.ReactNode;
  icon?: IconType;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
  colors?: "default" | "collection" | "custom";
}

export const Badge = (props: BadgeProps) => {
  const {
    children = null,
    icon: Icon,
    className = "",
    itemClassName = "",
    iconClassName = "",
    colors = "default",
    iconSize = 14,
    onClick = () => {},
    onMouseEnter = () => {},
    onMouseLeave = () => {},
  } = props;

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={clx(styles.container, className, {
        [styles.default]: colors === "default",
        "bg-collection-light-vibrant text-collection-dark-vibrant dark:bg-collection-dark-vibrant dark:text-white":
          colors === "collection",
      })}
    >
      {Icon && (
        <Icon width={iconSize} height={iconSize} className={`${styles.icon} ${iconClassName}`} />
      )}

      <span
        className={clx(itemClassName, {
          "bg-gradient-mr bg-clip-text text-transparent": colors === "default",
          // 'text-collection-light-vibrant': colors === 'collection',
        })}
      >
        {children}
      </span>
    </div>
  );
};

export default Badge;
