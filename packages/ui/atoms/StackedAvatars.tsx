"use client";

import { useIsMobile } from "@cobuild/libs/hooks/useIsScreenSize";
import pluralize from "pluralize";
import { Children, PropsWithChildren, useEffect, useMemo, useState } from "react";

interface Props {
  max?: number | { mobile: number; desktop: number };
  className?: string;
}

export const StackedAvatars = (props: PropsWithChildren<Props>) => {
  const { children, className = "" } = props;
  const isMobile = useIsMobile();
  const [max, setMax] = useState(5);

  useEffect(() => {
    setMax(chooseMax(props.max, isMobile))
  }, [max, isMobile]);

  const items = useMemo(() => Children.toArray(children), [children]);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex flex-shrink-0 -space-x-1.5">
        {items.slice(0, max).map((item, i) => (
          <div
            key={(item as any).key || `stacked_${i}`}
            className="relative flex rounded-full ring-2 ring-orange-50 dark:ring-zinc-700"
          >
            {item}
          </div>
        ))}
      </div>
      {items.length > max && (
        <div className="flex-shrink-0 text-xs font-medium leading-5">
          +{items.length - max} {pluralize("other", items.length - max)}
        </div>
      )}
    </div>
  );
};

function chooseMax(max: Props["max"] = 5, isMobile: boolean) {
  if (typeof max === "number") return max;
  if (typeof max === "object" && max.mobile && max.desktop)
    return isMobile ? max.mobile : max.desktop;
  return 5;
}
