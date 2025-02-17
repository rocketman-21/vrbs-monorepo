"use client";

import { useUser } from "@cobuild/libs/hooks/useUser";
import { getChain } from "@cobuild/libs/web3/utils";
import { mintHouseAbi } from "@cobuild/libs/web3/wagmi";
import { Button } from "@cobuild/ui/atoms/Button";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { revalidateTags } from "app/libs/revalidate";
import { useContractWrite } from "app/libs/useContractWrite";
import { useRevolution } from "app/libs/useRevolution";
import { useRouter } from "next/navigation";

interface Props {
  disabled: boolean;
  chainId: number;
  contract: `0x${string}`;
}

export const CreateDropButton = (props: Props) => {
  const { disabled, chainId, contract } = props;

  const router = useRouter();
  const { isConnected, user } = useUser();
  const { revolutionId } = useRevolution();

  const { write, status } = useContractWrite({
    chainId,
    contract,
    type: "createZoraDrop",
    successText: "Drop created!",
    waitingText: "Creating...",
    onSuccess: async () => {
      await revalidateTags(["drop"], 500);
      router.push(`${revolutionId}/drop`);
    },
  });

  return (
    <Button
      size="base"
      color="outline"
      disabled={disabled || status !== "idle"}
      pulse={status !== "idle"}
      onClick={async () => {
        try {
          if (!user) throw new Error("Please login");
          if (!isConnected) throw new Error("Please connect your wallet");

          await write(async client => {
            return client.simulateContract({
              account: user,
              address: contract,
              abi: mintHouseAbi,
              chain: getChain(chainId),
              functionName: "createNewMint",
            });
          });
        } catch (e: any) {
          console.error(e);
          toast.error(e?.message || "Failed to create drop");
        }
      }}
    >
      Start drop
    </Button>
  );
};
