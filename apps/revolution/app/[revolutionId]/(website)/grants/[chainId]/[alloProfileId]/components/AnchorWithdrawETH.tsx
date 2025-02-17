"use client";

import { IGrant, Serialized } from "@cobuild/database/types";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { anchorAbi } from "@cobuild/libs/web3/allo/anchorAbi";
import { getChain } from "@cobuild/libs/web3/utils";
import { Button } from "@cobuild/ui/atoms/Button";
import { useContractWrite } from "app/libs/useContractWrite";
import { useRouter } from "next/navigation";
import ClaimIcon from "@cobuild/ui/pixel-icons/CheckDouble";

interface Props {
  grant: Serialized<IGrant>;
}

export function AnchorWithdrawETH(props: Props) {
  const { grant } = props;
  const { ethBalance } = grant.poolBalance;
  const router = useRouter();
  const { user } = useUser();

  const { write, status } = useContractWrite({
    chainId: grant.chainId,
    contract: grant.alloProfile.anchor,
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
      disabled={status !== "idle"}
      color={hasEnough ? "primary" : "outline"}
      onClick={async () => {
        await write(client => {
          return client.simulateContract({
            account: user ?? undefined,
            address: grant.alloProfile.anchor,
            abi: anchorAbi,
            chain: getChain(grant.chainId),
            functionName: "execute",
            args: [grant.alloProfile.owner, BigInt(ethBalance), "0x"],
          });
        });
      }}
    >
      <ClaimIcon className="mr-1.5 size-3.5" />
      Claim
    </Button>
  );
}
