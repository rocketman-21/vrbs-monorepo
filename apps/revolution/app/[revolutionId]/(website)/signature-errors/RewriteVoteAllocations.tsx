"use client";

import { Button } from "@cobuild/ui/atoms/Button";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useState } from "react";
import { etherscanNetworkUrl } from "@cobuild/libs/utils/url";
import { base } from "viem/chains";
import { useRewriteVoteAllocations } from "./useRewriteVoteAllocations";

export default function RewriteVoteAllocations({
  recipients,
  voters,
  allocations,
}: {
  recipients: `0x${string}`[][];
  voters: `0x${string}`[];
  allocations: number[][];
}) {
  const [hash, setHash] = useState<string | null>(null);

  const onSuccess = (hash: `0x${string}`) => {
    toast.success("Votes updated!");
    setHash(hash);
  };

  const { deploy, isWriting, isAwaitingTransaction } = useRewriteVoteAllocations(
    onSuccess,
    base.id,
    recipients,
    voters,
    allocations,
  );

  return (
    <div className="w-full overflow-hidden rounded-2xl">
      <Button onClick={() => deploy()} roundedFull disabled={isWriting || isAwaitingTransaction}>
        {isAwaitingTransaction
          ? "Awaiting transaction..."
          : isWriting
            ? "Lighting Fire"
            : "Rewrite Allocations"}
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
