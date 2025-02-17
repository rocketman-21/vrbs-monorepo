import classNames from "classnames";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  size?: "xxs" | "xs" | "sm";
  variant?: "default" | "light" | "custom";
  className?: string;
}

export const Tag = (props: Props) => {
  const {
    children,
    size = "sm",
    className = "",
    variant = className.includes("bg") ? "custom" : "default",
  } = props;

  return (
    <div
      className={classNames(className, "inline-flex shrink-0 select-none items-center space-x-2", {
        "bg-zinc-100 text-zinc-900 dark:bg-zinc-500 dark:text-white": variant === "default",
        "bg-zinc-50 text-zinc-900 dark:bg-zinc-800 dark:text-white": variant === "light",
        "rounded-md p-2 text-xs": size === "sm",
        "rounded-md px-2 py-1.5 text-xs": size === "xs",
        "rounded-xs px-2 py-[5px] text-[10px]": size === "xxs",
      })}
    >
      <span className="max-w-[200px] truncate font-normal leading-none">{children}</span>
    </div>
  );
};
