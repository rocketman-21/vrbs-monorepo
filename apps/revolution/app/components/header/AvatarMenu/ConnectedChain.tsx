"use client";

import { useUser } from "@cobuild/libs/hooks/useUser";
import { getChain } from "@cobuild/libs/web3/utils";
import SvgArrowRight from "@cobuild/ui/pixel-icons/ArrowRight";
import { useRevolution } from "app/libs/useRevolution";
import clsx from "classnames";
import { useAccount, useSwitchChain } from "wagmi";

export const ConnectedChain = () => {
  const { chain: connectedChain } = useAccount();
  const { chainId, name } = useRevolution();
  const { switchChainAsync } = useSwitchChain();
  const { connect } = useUser();

  if (!connectedChain)
    return (
      <button
        className="flex w-full items-center justify-between bg-yellow-100/75 px-5 py-2 text-xs duration-100 ease-in-out hover:bg-yellow-200/75 dark:bg-yellow-200/75 dark:text-black dark:hover:bg-yellow-100/75"
        type="button"
        onClick={() => connect()}
      >
        <span>Wallet not connected</span>
        <span className="flex items-center">
          Connect <SvgArrowRight className="ml-1 size-4" />
        </span>
      </button>
    );

  const isOnCorrectChain = connectedChain.id === chainId;

  return (
    <button
      className={clsx(
        "flex w-full items-center justify-between px-5 py-2 text-xs duration-100 ease-in-out dark:text-black",
        {
          "bg-yellow-100/75 hover:bg-yellow-200/75 dark:bg-yellow-200/80 dark:hover:bg-yellow-100/75":
            !isOnCorrectChain,
          "bg-green-100/75 dark:bg-green-300/80": isOnCorrectChain,
        },
      )}
      disabled={isOnCorrectChain}
      onClick={() => {
        if (!switchChainAsync) return;
        switchChainAsync({ chainId }).catch(console.debug);
      }}
    >
      <span>Connected to {getChain(connectedChain.id).name}</span>

      {!isOnCorrectChain && (
        <span className="flex items-center">
          Switch <SvgArrowRight className="ml-1 size-4" />
        </span>
      )}
    </button>
  );
};
