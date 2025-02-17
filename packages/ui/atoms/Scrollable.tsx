import clsx from "classnames";
import { HTMLProps } from "react";

type Props = HTMLProps<HTMLDivElement> & {
  horizontal?: boolean;
  vertical?: boolean;
};

export const Scrollable = (props: Props) => {
  const { className, horizontal, vertical, ...rest } = props;
  return (
    <div
      className={clsx(
        "scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-zinc-100 dark:scrollbar-thumb-zinc-600 dark:scrollbar-track-zinc-900 scrollbar-thumb-rounded-lg",
        className,
        {
          'overflow-y-auto': vertical,
          'overflow-x-auto whitespace-nowrap w-full max-w-full': horizontal,
        }
      )}
      {...rest}
    />
  );
};
