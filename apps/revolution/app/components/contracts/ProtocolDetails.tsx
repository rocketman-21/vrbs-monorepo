"use client";

import { NetworkLogo } from "@cobuild/ui/molecules/NetworkLogo/NetworkLogo";
import { useRevolution } from "app/libs/useRevolution";

export default function SmartContractDetails() {
  const { name, chainId } = useRevolution();

  return (
    <>
      <div className="flex items-center space-x-2">
        <h1 className="mr-1 text-2xl font-semibold dark:text-white">{name} Smart Contracts</h1>
        <NetworkLogo chainId={chainId} size={20} />
      </div>
      <p className="mb-6 mt-2.5 text-zinc-700 max-sm:text-sm dark:text-white">
        You can find the latest information on the Revolution protocol on{" "}
        <a
          target="_blank"
          className="underline"
          href="https://github.com/collectivexyz/revolution-protocol"
        >
          Github
        </a>
        . Upgrades to these smart contract can be completed by submitting a proposal to the DAO, and
        require a successful vote to execute.
      </p>
    </>
  );
}
