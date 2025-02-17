"use client";

import clsx from "classnames";

interface Props {
  count: number;
  onClick: () => void;
  isMuted: boolean;
  color?: string;
}

export const VoteTickerSerie = (props: Props) => {
  const { count, color, onClick, isMuted } = props;

  if (count === 0) return null;

  return [...Array(count)].map((_, i) => (
    <button className="flex-1 p-0.5" key={i} onClick={onClick} type="button">
      <div
        className={clsx(
          `h-6 w-full max-w-[4px] cursor-pointer rounded-[4px] duration-200 dark:contrast-75`,
          { "opacity-20": isMuted },
        )}
        style={{ backgroundColor: color }}
      />
    </button>
  ));
};
