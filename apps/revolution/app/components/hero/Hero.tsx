"use client";

import { useBrowserLayoutEffect } from "@cobuild/libs/hooks/useLayoutEffect";
import Image from "next/image";

interface Props {
  backdropImage: string;
  name: string;
  tagline: string | null;
  logoUrl: string;
}

export const Hero = (props: Props) => {
  const { backdropImage, name, tagline, logoUrl } = props;

  useBrowserLayoutEffect(() => {
    document.body.dataset.headerOverlay = "true";
    return () => {
      document.body.dataset.headerOverlay = "false";
    };
  }, []);

  return (
    <header className="relative flex h-[240px] flex-col items-center justify-end lg:h-[360px] dark:bg-black">
      <div className="relative z-10 flex w-full max-w-screen-2xl items-center px-4 pb-6 lg:px-6 xl:px-8">
        <div className="mr-4 flex shrink-0 overflow-hidden rounded-xl p-[3px] max-sm:hidden lg:mr-6">
          <Image
            src={logoUrl}
            width={128}
            height={128}
            alt={name}
            className="h-16 w-16 rounded-xl object-contain lg:h-32 lg:w-32"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold leading-none tracking-tighter text-white lg:text-6xl">
            {name}
          </h1>
          {tagline && (
            <h2 className="mt-1.5 max-w-xl whitespace-break-spaces text-sm text-white lg:text-lg lg:leading-tight">
              {tagline}
            </h2>
          )}
        </div>
      </div>
      <Image
        src={backdropImage}
        width={1440}
        height={360}
        priority
        alt={name}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 via-black/40 to-black/0"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-black/50 via-black/40 to-black/0"
        aria-hidden
      />
    </header>
  );
};
