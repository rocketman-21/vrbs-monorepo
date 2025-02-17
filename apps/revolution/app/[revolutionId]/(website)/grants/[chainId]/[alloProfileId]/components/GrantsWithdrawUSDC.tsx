"use client";

import { BASE_USDC_ADDRESS } from "@cobuild/database/models/revolution/revolutions/addresses";
import { IGrant, Serialized } from "@cobuild/database/types";
import { deleteCacheResult } from "@cobuild/libs/cache";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { getChain } from "@cobuild/libs/web3/utils";
import { revolutionGrantsBetaAbi } from "@cobuild/libs/web3/wagmi";
import { Button } from "@cobuild/ui/atoms/Button";
import { useContractWrite } from "app/libs/useContractWrite";
import { useRouter } from "next/navigation";
import { encodeFunctionData, erc20Abi } from "viem";

interface Props {
  grant: Serialized<IGrant>;
}

export function GrantsWithdrawUSDC(props: Props) {
  const { grant } = props;
  const { ethBalance, usdcBalance } = grant.poolBalance;
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
      await deleteCacheResult(`usdc_balance_${grant.salaryRecipientAddress}_${grant.chainId}`);
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
          const calldata = encodeFunctionData({
            abi: erc20Abi,
            functionName: "transfer",
            args: [grant.alloProfile.owner, BigInt(usdcBalance)],
          });

          return client.simulateContract({
            account: user ?? undefined,
            address: grant.contractAddress as `0x${string}`,
            abi: revolutionGrantsBetaAbi,
            chain: getChain(grant.chainId),
            functionName: "execute",
            args: [BASE_USDC_ADDRESS, 0n, calldata],
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
