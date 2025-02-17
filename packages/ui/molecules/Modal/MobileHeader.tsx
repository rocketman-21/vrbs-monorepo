"use client";

import { IconButton } from "../../atoms/IconButton";
import ChevronLeft from "../../pixel-icons/ChevronLeft";

interface IProps {
  title: string;
  onLeftClick: () => void;
}

export const MobileHeader = (props: IProps) => {
  const { title, onLeftClick } = props;

  return (
    <div className="flex w-full shrink-0 items-center justify-between border-b border-zinc-100 px-2 py-4 md:hidden dark:border-zinc-600">
      <div className="w-8 shrink-0">
        <IconButton onClick={onLeftClick}>
          <ChevronLeft className="h-6 w-6" />
        </IconButton>
      </div>
      <h2 className="line-clamp-1 text-base font-semibold leading-none text-zinc-900 dark:text-white">
        {title}
      </h2>
      <div className="w-8 shrink-0" />
    </div>
  );
};
