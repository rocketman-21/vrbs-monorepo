"use client";

import { Button } from "@cobuild/ui/atoms/Button";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { TxnWalletStatus } from "app/components/onchain/TxnWalletStatus";
import { useRevolution } from "app/libs/useRevolution";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zeroAddress } from "viem";
import { useSettleAuction } from "./hooks/useSettleAuction";
import { revalidateAuction } from "./revalidateAuction";

interface Props {
  isPaused: boolean;
}

export const AuctionSettleButton = (props: Props) => {
  const { isPaused } = props;
  const { revolutionId, addresses, chainId } = useRevolution();
  const [toastId, setToastId] = useState<string>("");

  const router = useRouter();

  const { settleAuction, isSettling, isAwaitingTransaction, transactionHash, isSuccess } =
    useSettleAuction(
      addresses?.auction || zeroAddress,
      addresses?.cultureIndex || zeroAddress,
      chainId,
      isPaused === false,
      async () => {
        await revalidateAuction(revolutionId);
        toast.success("Auction settled!", { id: toastId, duration: 10000 });
        router.push(`/${revolutionId}/auction`);
      },
      () => {
        const id = toast.loading("Saving onchain...", { duration: 60000 });
        setToastId(id);
      },
      toastId,
    );

  return (
    <div className="space-y-2.5">
      <Button
        onClick={() => settleAuction()}
        fullWidth
        size="lg"
        className="lg:max-w-xs"
        disabled={isSettling || isAwaitingTransaction || isPaused}
      >
        Start next auction
      </Button>
      <TxnWalletStatus
        isAwaitingTransaction={isAwaitingTransaction}
        isAwaitingWallet={isSettling}
        chainId={chainId}
        isSuccessful={isSuccess}
        transactionHash={transactionHash}
      />
    </div>
  );
};
