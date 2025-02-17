"use client";

import clsx from "classnames";
import { Children, PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<{
  caption?: ReactNode;
}>;

export const Grid = (props: Props) => {
  const { caption } = props;
  const children = Children.toArray(props.children).filter(Boolean);
  const count = children.length;

  if (count === 0) return null;

  return (
    <div
      className={clsx("grid w-full gap-3 px-3 md:gap-4 md:px-6", {
        "grid-cols-1": count === 1,
        "grid-cols-1 md:grid-cols-2": count === 2,
        "grid-cols-1 md:grid-cols-3": count > 2,
      })}
    >
      {children.map((child, index) => (
        <div key={index.toString(36)}>{child}</div>
      ))}

      {caption && (
        <div className="col-span-full flex justify-center md:-translate-y-1.5 md:justify-end">
          <span className="dark:text-lead-50 min-w-[64px] text-xs opacity-80 md:text-right md:text-sm">
            {caption}
          </span>
        </div>
      )}
    </div>
  );
};
