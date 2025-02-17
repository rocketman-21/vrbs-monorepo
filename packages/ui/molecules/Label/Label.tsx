"use client";

import { ReactNode } from "react";
import { ConditionalWrapper } from "../../atoms/ConditionalWrapper";
import { Tooltip } from "../../atoms/Tooltip/Tooltip";

interface Props {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  tooltip?: string;
}

export const Label = (props: Props) => {
  const { children, icon, className, tooltip } = props;

  return (
    <ConditionalWrapper
      condition={!!tooltip}
      wrapper={children => (
        <Tooltip title={tooltip} interactive={false}>
          {children}
        </Tooltip>
      )}
    >
      <span
        className={`inline-flex items-center whitespace-nowrap rounded-[40px] bg-zinc-100 px-2.5 py-1 text-[11px] uppercase text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 ${className}`}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
      </span>
    </ConditionalWrapper>
  );
};

export default Label;
