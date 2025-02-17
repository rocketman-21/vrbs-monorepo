"use client";

import { useIsMobile } from "@cobuild/libs/hooks/useIsScreenSize";
import { ConditionalWrapper } from "@cobuild/ui/atoms/ConditionalWrapper";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { useEffect, useState } from "react";

export const MobileConditionalTooltip = ({
  subtitle,
  children,
  className,
}: {
  subtitle: string;
  className?: string;
  children: React.ReactNode;
}) => {
  const isMobile = useIsMobile();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setShowTooltip(isMobile === false);
  }, [isMobile]);

  return (
    <ConditionalWrapper
      condition={showTooltip}
      wrapper={children => (
        <Tooltip className={className || ""} subtitle={subtitle}>
          {children}
        </Tooltip>
      )}
    >
      {children}
    </ConditionalWrapper>
  );
};
