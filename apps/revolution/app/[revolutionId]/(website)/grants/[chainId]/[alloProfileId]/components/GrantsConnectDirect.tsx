"use client";

import { GDA_FORWARDER } from "@cobuild/database/models/revolution/revolutions/addresses";
import { IGrant, Serialized } from "@cobuild/database/types";
import { deleteCacheResult } from "@cobuild/libs/cache";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { anchorAbi } from "@cobuild/libs/web3/allo/anchorAbi";
import { getChain } from "@cobuild/libs/web3/utils";
import { gdAv1ForwarderAbi } from "@cobuild/libs/web3/wagmi";
import { Button } from "@cobuild/ui/atoms/Button";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { useContractWrite } from "app/libs/useContractWrite";
import { useRouter } from "next/navigation";
import { encodeFunctionData, formatEther } from "viem";

interface Props {
  grant: Serialized<IGrant>;
  className?: string;
}

export function GrantsConnectDirect(props: Props) {
  const { grant, className } = props;
  const { superTokenBalance, claimableBalance } = grant.poolBalance;
  const router = useRouter();
  const { user } = useUser();

  const { write: writeAnchor, status } = useContractWrite({
    chainId: grant.chainId,
    contract: grant.alloProfile.anchor,
    type: "claimGrant",
    // trackerType: "revolution_auction",
    successText: "Connected!",
    waitingText: "Connecting...",
    onSuccess: async () => {
      await Promise.all([
        deleteCacheResult(
          `isMemberConnectedToPool_${grant.parentPool}_${grant.salaryRecipientAddress}`,
        ),
        deleteCacheResult(
          `balance_${grant.salaryRecipientAddress}_${grant.poolBalance.superToken}`,
        ),
      ]);
      setTimeout(() => router.refresh(), 500);
    },
  });

  const roundedSuperTokenBalance = parseFloat(
    formatEther(BigInt(superTokenBalance || claimableBalance)),
  ).toFixed(5);

  return (
    <Tooltip title={`Connect to pool to claim $${roundedSuperTokenBalance}`}>
      <Button
        disabled={status !== "idle"}
        size="sm"
        className={className}
        onClick={async () => {
          await writeAnchor(client => {
            const functionName = "connectPool";

            // Encode function signature and parameters
            const calldata = encodeFunctionData({
              abi: gdAv1ForwarderAbi,
              functionName,
              args: [grant.parentPool, "0x"],
            });

            return client.simulateContract({
              account: user ?? undefined,
              address: grant.alloProfile.anchor,
              abi: anchorAbi,
              chain: getChain(grant.chainId),
              functionName: "execute",
              args: [GDA_FORWARDER[grant.chainId], 0n, calldata],
            });
          });
        }}
      >
        Connect
      </Button>
    </Tooltip>
  );
}
