import { PropsWithChildren, ReactNode } from "react";

interface Props {
  label: string;
  action?: ReactNode;
}

export const SidebarStat = (props: PropsWithChildren<Props>) => {
  const { children, label, action } = props;

  return (
    <div className="rounded-xl border border-zinc-300 p-3.5 dark:border-zinc-600">
      <h5 className="text-xs text-zinc-600 dark:text-zinc-300">{label}</h5>

      <div className="text-lead-500 dark:text-lead-300 mt-1.5 inline-flex items-center space-x-1.5 text-xl font-medium tracking-tight md:text-2xl">
        {children}
      </div>

      {action && <div className="mt-2.5">{action}</div>}
    </div>
  );
};
