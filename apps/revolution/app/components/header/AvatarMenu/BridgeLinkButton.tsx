"use client";

import BridgeIcon from "@cobuild/ui/pixel-icons/ArrowLeftBox";
import Link from "next/link";

export const BridgeLinkButton = () => {
  return (
    <Link target="_blank" href="https://relay.link/bridge/base/?fromChainId=1">
      <button className="flex w-full items-center justify-start space-x-2 rounded-lg bg-blue-100 px-5 py-3 text-xs duration-100 ease-in-out hover:bg-blue-300 dark:bg-blue-300/65 dark:text-black">
        <BridgeIcon className="size-[18px]" />
        <span>Bridge funds</span>
      </button>
    </Link>
  );
};
