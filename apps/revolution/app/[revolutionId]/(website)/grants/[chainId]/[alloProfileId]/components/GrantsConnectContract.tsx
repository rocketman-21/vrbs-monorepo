"use client";

import { GDA_FORWARDER } from "@cobuild/database/models/revolution/revolutions/addresses";
import { IGrant, Serialized } from "@cobuild/database/types";
import { deleteCacheResult } from "@cobuild/libs/cache";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { getChain } from "@cobuild/libs/web3/utils";
import { gdAv1ForwarderAbi, revolutionGrantsBetaAbi } from "@cobuild/libs/web3/wagmi";
import { Button } from "@cobuild/ui/atoms/Button";
import ConnectIcon from "@cobuild/ui/pixel-icons/Attachment";
import { useContractWrite } from "app/libs/useContractWrite";
import { useRouter } from "next/navigation";
import { encodeFunctionData } from "viem";

interface Props {
  grant: Serialized<IGrant>;
}

export function GrantsConnectContract(props: Props) {
  const { grant } = props;
  const router = useRouter();
  const { user } = useUser();
  const { contractAddress: contract } = grant;

  const { write, status } = useContractWrite({
    chainId: grant.chainId,
    contract: contract as `0x${string}`,
    type: "claimGrant",
    successText: "Connected!",
    waitingText: "Connecting...",
    onSuccess: async () => {
      await deleteCacheResult(
        `isMemberConnectedToPool_${grant.parentPool}_${grant.salaryRecipientAddress}`,
      );
      await deleteCacheResult(
        `balance_${grant.salaryRecipientAddress}_${grant.poolBalance.superToken}`,
      );
      setTimeout(() => router.refresh(), 500);
    },
  });

  if (!contract) return null;

  return (
    <Button
      disabled={status !== "idle"}
      type="button"
      color="outline"
      size="sm"
      onClick={async () => {
        await write(client => {
          const functionName = "connectPool";

          // Encode function signature and parameters
          const calldata = encodeFunctionData({
            abi: gdAv1ForwarderAbi,
            functionName,
            args: [grant.parentPool, "0x"],
          });

          return client.simulateContract({
            account: user ?? undefined,
            address: contract as `0x${string}`,
            abi: revolutionGrantsBetaAbi,
            chain: getChain(grant.chainId),
            functionName: "execute",
            args: [GDA_FORWARDER[grant.chainId], 0n, calldata],
          });
        });
      }}
    >
      <ConnectIcon className="mr-1.5 size-3.5" />
      Connect
    </Button>
  );
}
