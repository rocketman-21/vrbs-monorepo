import { PropsWithChildren, ReactNode } from "react";
import { PercentChange } from "@cobuild/ui/atoms/PercentChange";

interface Props {
  label: string;
  action?: ReactNode;
  percentChange?: number;
}

export const GrowthStat = (props: PropsWithChildren<Props>) => {
  const { children, label, action, percentChange } = props;

  return (
    <div className="flex flex-col space-y-2 rounded-xl border border-zinc-300 p-3.5 dark:border-zinc-600">
      <h5 className="text-xs text-zinc-600 dark:text-zinc-300">{label}</h5>

      <div className="flex items-center space-x-2">
        <div className="inline-flex items-center space-x-1.5 text-xl font-medium tracking-tight md:text-2xl">
          {children}
        </div>

        {percentChange !== undefined && !Number.isNaN(percentChange) && (
          <PercentChange size="sm" value={percentChange} />
        )}
      </div>

      {action && <div className="mt-2.5">{action}</div>}
    </div>
  );
};
