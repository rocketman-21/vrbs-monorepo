import clsx from "classnames";
import { PropsWithChildren } from "react";

export const MetaItem = (props: PropsWithChildren<{ label: string; columns?: 1 | 2 }>) => {
  const { label, columns = 1, children } = props;

  return (
    <dl className={clsx("space-y-2", { "max-sm:col-span-2": columns === 2 })}>
      <dt className="text-xs text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="flex flex-col items-start text-sm">{children}</dd>
    </dl>
  );
};
