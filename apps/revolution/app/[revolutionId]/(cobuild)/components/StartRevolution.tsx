"use client";

import { Button } from "@cobuild/ui/atoms/Button";
import { useDeployRevolution } from "../hooks/useDeployRevolution";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useState } from "react";
import { etherscanNetworkUrl } from "@cobuild/libs/utils/url";
import { base, baseSepolia } from "viem/chains";

export default function StartARevolution() {
  const [hash, setHash] = useState<string | null>(null);

  const onSuccess = (hash: `0x${string}`) => {
    toast.success("Revolution deployed!");
    setHash(hash);
  };

  const { deploy, isWriting, isAwaitingTransaction } = useDeployRevolution(
    onSuccess,
    baseSepolia.id,
  );

  return (
    <div className="w-full overflow-hidden rounded-2xl">
      <Button onClick={() => deploy()} roundedFull disabled={isWriting || isAwaitingTransaction}>
        {isAwaitingTransaction
          ? "Awaiting transaction..."
          : isWriting
            ? "Lighting Fire"
            : "Start a Revolution"}
      </Button>
      {hash && (
        <div className="mt-4">
          <a
            href={etherscanNetworkUrl(hash, base.id, "tx")}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Etherscan
          </a>
        </div>
      )}
    </div>
  );
}
