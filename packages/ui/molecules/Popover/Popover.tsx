"use client";

import { useIsMobile } from "@cobuild/libs/hooks/useIsScreenSize";
import { Placement } from "@floating-ui/react-dom";
import { ReactNode, useEffect, useState } from "react";
import { SlideUp } from "../../atoms/SlideUp";
import { PopoverDesktop } from "./PopoverDesktop";

export interface Props {
  children:
    | ReactNode
    | ((props: { isOpen: boolean; close: () => void; updatePosition?: () => void }) => ReactNode);
  button: ReactNode | ((props: { isOpen: boolean }) => ReactNode);
  placement?: Placement;
  className?: string;
  disabled?: boolean;
  onHover?: boolean;
}

export const Popover = (props: Props) => {
  const [variant, setVariant] = useState<"desktop" | "mobile">("desktop");
  const isMobile = useIsMobile();

  useEffect(() => {
    setVariant(isMobile ? "mobile" : "desktop");
  }, [isMobile]);

  return variant === "mobile" ? <PopoverMobile {...props} /> : <PopoverDesktop {...props} />;
};

const PopoverMobile = (props: Props) => {
  const { children, button, disabled } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(c => !c)} disabled={disabled}>
        {typeof button === "function" ? button({ isOpen }) : button}
      </button>
      <SlideUp isOpen={isOpen} close={() => setIsOpen(false)}>
        {children}
      </SlideUp>
    </>
  );
};
