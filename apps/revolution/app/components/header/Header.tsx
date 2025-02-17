"use client";

import { useIsMobile } from "@cobuild/libs/hooks/useIsScreenSize";
import { useScrollPosition } from "@cobuild/libs/hooks/useScrollPosition";
import classNames from "classnames";
import { useSelectedLayoutSegment, useSelectedLayoutSegments } from "next/navigation";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";

export interface Props {
  revolutionId: string;
}

export default function Header(props: PropsWithChildren<Props>) {
  const { revolutionId, children } = props;
  const { isVisible, isOpaque } = useNavVisiblity(revolutionId);

  return (
    <header
      className={classNames(
        "scroll-lock:-translate-y-full fixed top-0 z-50 w-full shrink-0 duration-300",
        {
          "-translate-y-full": !isVisible,
          "opaque bg-white/70 backdrop-blur-xl dark:bg-[#111]/80": isOpaque,
        },
      )}
    >
      <div className="3xl:container mx-auto flex h-16 max-w-screen-2xl items-center justify-between space-x-2 px-4 md:h-20 lg:px-6">
        {children}
      </div>
    </header>
  );
}

const useNavVisiblity = (revolutionId: string) => {
  const segment = useSelectedLayoutSegment();
  const segments = useSelectedLayoutSegments();
  const isMobile = useIsMobile();
  const { scrollPosition, scrollDirection } = useScrollPosition();
  const [isOpaque, setIsOpaque] = useState(false);

  const isCreationsPage = useMemo(
    () => segment === "creations" && segments.length === 1,
    [segments, segment],
  );

  const isCreationsPageMobile = isCreationsPage && isMobile;
  const isCreationsPageDesktop = isCreationsPage && !isMobile;

  const isVisible = useMemo(
    () => scrollPosition < 32 || scrollDirection === "up" || isCreationsPageDesktop,
    [scrollPosition, scrollDirection, isCreationsPageDesktop],
  );

  // Show opaque nav when scrolling down or on mobile creations page
  useEffect(() => {
    setIsOpaque(scrollPosition > 32 || isCreationsPageMobile);
  }, [isCreationsPageDesktop, isCreationsPageMobile, scrollPosition]);

  return { isOpaque, isVisible, scrollPosition };
};
