"use client";

import { Button } from "@cobuild/ui/atoms/Button";
import { TextInput } from "@cobuild/ui/atoms/TextInput/TextInput";
import { TxnWalletStatus } from "app/components/onchain/TxnWalletStatus";
import { useRevolution } from "app/libs/useRevolution";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatEther, parseEther, zeroAddress } from "viem";
import { RelayNetworkSelect } from "./RelayNetworkSelect";
import { useCreateBid } from "./hooks/useCreateBid";

type Props = {
  tokenId: string;
  isPaused: boolean;
  amount: number;
};

export const AuctionBidForm = (props: Props) => {
  const { addresses, chainId } = useRevolution();

  const { tokenId, isPaused, amount } = props;

  const [bidAmount, setBidAmount] = useState("");
  const [fromChainId, setFromChainId] = useState<number>(chainId);
  const router = useRouter();
  const [buttonText, setButtonText] = useState("Place bid");

  const { auction } = useRevolution();

  const minBid = getMinBid(
    amount,
    auction?.reservePrice || 0,
    auction?.minBidIncrementPercentage || 0,
  );

  const { createBid, status, transactionHash, isSuccess, isOnCorrectNetwork, isConnected } =
    useCreateBid({
      contract: addresses?.auction || zeroAddress,
      fromChainId,
      chainId,
      tokenId,
      bidAmount: parseEther(bidAmount),
      isPaused,
      minBid: BigInt(minBid),
      onSuccess: () => {
        router.refresh(); // Reload bid history
        setBidAmount("");
      },
    });

  useEffect(() => {
    if (!isConnected) {
      return setButtonText("Connect wallet");
    }

    if (!isOnCorrectNetwork) {
      return setButtonText("Switch network");
    }

    return setButtonText("Place bid");
  }, [isConnected, isOnCorrectNetwork]);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        createBid();
      }}
      className="w-full"
    >
      <fieldset className="mb-2.5 flex flex-col items-center justify-between space-y-2">
        <TextInput
          wrapperClassName="min-w-[200px] w-full bg-white/50 rounded-md dark:bg-black/30"
          value={bidAmount}
          name="bid"
          size="lg"
          placeholder={minBid > 0 ? `Ξ ${formatEther(BigInt(minBid))} or more` : "Enter bid amount"}
          onChange={e => setBidAmount(e.target.value)}
          autoComplete="off"
          noValidate
          append={<RelayNetworkSelect onChange={setFromChainId} defaultChainId={chainId} />}
          type="number"
          step="0.01"
        />
        <Button disabled={status !== "idle"} type="submit" size="lg" fullWidth>
          {buttonText}
        </Button>
      </fieldset>
      <TxnWalletStatus
        isAwaitingTransaction={status === "pending"}
        isAwaitingWallet={status === "sending"}
        chainId={chainId}
        isSuccessful={status === "idle" && isSuccess}
        transactionHash={transactionHash}
      />
    </form>
  );
};

function getMinBid(amount: number, reservePrice: number, minBidIncrementPercentage: number) {
  if (amount > 0) {
    return Math.trunc(amount * (1 + minBidIncrementPercentage / 100));
  }

  if (reservePrice > 0) {
    return reservePrice;
  }

  return 0;
}
