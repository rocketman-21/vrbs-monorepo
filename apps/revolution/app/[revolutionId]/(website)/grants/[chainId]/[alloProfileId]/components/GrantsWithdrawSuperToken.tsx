"use client";

import { VRBS_GRANTS_PROXY } from "@cobuild/database/models/revolution/revolutions/addresses";
import { IGrant, Serialized } from "@cobuild/database/types";
import { deleteCacheResult } from "@cobuild/libs/cache";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { anchorAbi } from "@cobuild/libs/web3/allo/anchorAbi";
import { getChain } from "@cobuild/libs/web3/utils";
import { superTokenAbi } from "@cobuild/libs/web3/wagmi";
import { Button } from "@cobuild/ui/atoms/Button";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import ClaimIcon from "@cobuild/ui/pixel-icons/CheckDouble";
import { useContractWrite } from "app/libs/useContractWrite";
import { useRouter } from "next/navigation";
import { encodeFunctionData, formatEther } from "viem";

interface Props {
  grant: Serialized<IGrant>;
  withdrawTo?: `0x${string}` | null;
  className?: string;
}

export function GrantsWithdrawSuperToken(props: Props) {
  const { grant, withdrawTo, className } = props;
  const { superTokenBalance, superToken } = grant.poolBalance;
  const router = useRouter();
  const { user } = useUser();

  const { write, status } = useContractWrite({
    chainId: grant.chainId,
    contract: VRBS_GRANTS_PROXY,
    type: "claimGrant",
    // trackerType: "revolution_auction",
    successText: "Claimed!",
    waitingText: "Claiming...",
    onSuccess: async () => {
      // `balance_${address}_${superToken}`
      await deleteCacheResult(`balance_${grant.alloProfile.anchor}_${superToken}`);
      setTimeout(() => router.refresh(), 500);
    },
  });

  const roundedSuperTokenBalance = parseFloat(formatEther(BigInt(superTokenBalance))).toFixed(8);
  const hasMoreThan10Cents = superTokenBalance > BigInt(10 ** 17);

  const isAlloOwner = grant.alloProfile.owner === user;

  return (
    <>
      <Tooltip
        title={
          isAlloOwner ? `Withdraw $${roundedSuperTokenBalance}` : "Only team leader can withdraw"
        }
      >
        <Button
          className={className}
          disabled={status !== "idle" || !isAlloOwner}
          color={hasMoreThan10Cents ? "primary" : "outline"}
          size="sm"
          onClick={async () => {
            await write(client => {
              const functionName = "downgradeTo";

              // Encode function signature and parameters
              const calldata = encodeFunctionData({
                abi: superTokenAbi,
                functionName,
                args: [withdrawTo || grant.alloProfile.owner, BigInt(superTokenBalance)],
              });

              return client.simulateContract({
                account: user ?? undefined,
                address: grant.alloProfile.anchor,
                abi: anchorAbi,
                chain: getChain(grant.chainId),
                functionName: "execute",
                args: [grant.poolBalance.superToken, 0n, calldata],
              });
            });
          }}
        >
          <ClaimIcon className="mr-1.5 size-3.5" />
          Claim
        </Button>
      </Tooltip>
    </>
  );
}
