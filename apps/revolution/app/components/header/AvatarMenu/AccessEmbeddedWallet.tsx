"use client";

import SvgWallet from "@cobuild/ui/pixel-icons/Wallet";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import dynamic from "next/dynamic";

const DynamicUserProfile = dynamic(
  () => import("@dynamic-labs/sdk-react-core").then(mod => mod.DynamicUserProfile),
  { ssr: false },
);
export const AccessEmbeddedWallet = () => {
  const { setShowDynamicUserProfile } = useDynamicContext();

  return (
    <>
      <button
        className="flex items-center justify-start space-x-2 rounded-lg bg-blue-100 px-4 py-1 text-xs duration-100 ease-in-out hover:bg-blue-300 dark:bg-blue-300/65 dark:text-black"
        onClick={() => {
          setShowDynamicUserProfile(true);
        }}
      >
        <span className="text-xs">Wallet</span> <SvgWallet className="size-[18px]" />
      </button>
      <DynamicUserProfile />
    </>
  );
};
