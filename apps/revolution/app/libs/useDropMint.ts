"use client";

import { useUser } from "@cobuild/libs/hooks/useUser";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { createCollectorClient } from "@zoralabs/protocol-sdk";
import { useRouter } from "next/navigation";
import { revalidateTags } from "./revalidate";
import { useContractWrite } from "./useContractWrite";
import { useRevolution } from "./useRevolution";

export function useDropMint(data: { chainId: number; contract: `0x${string}`; tokenId: string }) {
  const { chainId, contract, tokenId } = data;

  const { write, status } = useContractWrite({
    chainId,
    contract,
    type: "mintZoraDrop",
    successText: "Mint successful!",
    waitingText: "Minting...",
    onSuccess: async () => {
      await revalidateTags(["drop", "drops"]);
      router.refresh();
    },
  });

  const { isConnected, user } = useUser();
  const { config } = useRevolution();
  const router = useRouter();

  return {
    mint: async () => {
      try {
        if (!user) throw new Error("Please login");
        if (!isConnected) throw new Error("Please connect your wallet");

        await write(async client => {
          const collectorClient = createCollectorClient({ chainId, publicClient: client });

          const { parameters } = await collectorClient.mint({
            tokenContract: contract,
            mintType: "1155",
            tokenId: BigInt(tokenId),
            quantityToMint: 1,
            mintReferral: config.dao?.treasury.vaults?.[0]?.address,
            minterAccount: user,
          });

          return { request: parameters };
        });
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message || "Failed to mint");
      }
    },
    status,
  };
}
