"use client";

import { IGrant, Serialized } from "@cobuild/database/types";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { getChain } from "@cobuild/libs/web3/utils";
import { revolutionGrantsBetaAbi } from "@cobuild/libs/web3/wagmi";
import { Button } from "@cobuild/ui/atoms/Button";
import { useContractWrite } from "app/libs/useContractWrite";
import { useRouter } from "next/navigation";

interface Props {
  grant: Serialized<IGrant>;
}

export function GrantsWithdrawETH(props: Props) {
  const { grant } = props;
  const { ethBalance } = grant.poolBalance;
  const router = useRouter();
  const { user } = useUser();

  const { write, status } = useContractWrite({
    chainId: grant.chainId,
    contract: grant.contractAddress as `0x${string}`,
    type: "claimGrant",
    // trackerType: "revolution_auction",
    successText: "Claimed!",
    waitingText: "Claiming...",
    onSuccess: async () => {
      setTimeout(() => router.refresh(), 500);
    },
  });

  const hasEnough = ethBalance > BigInt(10 ** 14);

  return (
    <Button
      fullWidth
      disabled={status !== "idle"}
      color={hasEnough ? "primary" : "outline"}
      onClick={async () => {
        await write(client => {
          return client.simulateContract({
            account: user ?? undefined,
            address: grant.contractAddress as `0x${string}`,
            abi: revolutionGrantsBetaAbi,
            chain: getChain(grant.chainId),
            functionName: "execute",
            args: [grant.alloProfile.owner, BigInt(ethBalance), "0x"],
          });
        });
      }}
      grow
      size="md"
    >
      Claim
    </Button>
  );
}
