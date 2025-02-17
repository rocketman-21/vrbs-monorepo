"use client";

import { IGrant, Serialized } from "@cobuild/database/types";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { anchorAbi } from "@cobuild/libs/web3/allo/anchorAbi";
import { getChain } from "@cobuild/libs/web3/utils";
import { Button } from "@cobuild/ui/atoms/Button";
import { useContractWrite } from "app/libs/useContractWrite";
import { useRouter } from "next/navigation";
import ClaimIcon from "@cobuild/ui/pixel-icons/CheckDouble";
import { BASE_USDC_ADDRESS } from "@cobuild/database/models/revolution/revolutions/addresses";
import { encodeFunctionData, erc20Abi } from "viem";
import { deleteCacheResult } from "@cobuild/libs/cache";

interface Props {
  grant: Serialized<IGrant>;
}

export function AnchorWithdrawUSDC(props: Props) {
  const { grant } = props;
  const { usdcBalance } = grant.poolBalance;
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
      await deleteCacheResult(`usdc_balance_${grant.salaryRecipientAddress}_${grant.chainId}`);
      setTimeout(() => router.refresh(), 500);
    },
  });

  const hasEnough = usdcBalance > 1e4;

  return (
    <Button
      disabled={status !== "idle"}
      color={hasEnough ? "primary" : "outline"}
      onClick={async () => {
        await write(client => {
          // Encode function signature and parameters
          const calldata = encodeFunctionData({
            abi: erc20Abi,
            functionName: "transfer",
            args: [grant.alloProfile.owner, BigInt(usdcBalance)],
          });

          return client.simulateContract({
            account: user ?? undefined,
            address: grant.alloProfile.anchor,
            abi: anchorAbi,
            chain: getChain(grant.chainId),
            functionName: "execute",
            args: [BASE_USDC_ADDRESS, 0n, calldata],
          });
        });
      }}
    >
      <ClaimIcon className="mr-1.5 size-3.5" />
      Claim
    </Button>
  );
}
