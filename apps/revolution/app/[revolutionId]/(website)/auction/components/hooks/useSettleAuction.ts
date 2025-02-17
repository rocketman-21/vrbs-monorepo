"use client";

import { useCheckWallet } from "@cobuild/libs/hooks/useCheckWallet";
import { useWalletError } from "@cobuild/libs/hooks/useWalletError";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { useMaxHeapSize } from "@cobuild/libs/web3/revolution/useMaxHeapSize";
import { useQuorumVotesForPiece } from "@cobuild/libs/web3/revolution/useQuorumVotesForPiece";
import { auctionHouseAbi } from "@cobuild/revolution";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { formatVotes } from "app/components/Votes";
import { useRevolution } from "app/libs/useRevolution";
import { useWaitForTransaction } from "app/libs/useWaitForTransaction";
import { storeTransactionEvent } from "onchain-ingestion/functions/storeTransactionEvent";
import { useEffect } from "react";
import { useSimulateContract, useWriteContract } from "wagmi";
import { useTopVotedPieceMeetsQuorum } from "./useTopVotedPieceMeetsQuorum";

export const useSettleAuction = (
  contract: `0x${string}`,
  cultureIndexContract: `0x${string}`,
  chainId: number,
  enabled: boolean,
  onSuccess: (hash: string) => void,
  onPending: () => void,
  toastId: string,
) => {
  const { checkWallet } = useCheckWallet(chainId);
  const { cultureIndex, addresses } = useRevolution();
  const { reportWalletError } = useWalletError();

  const { size: maxHeapSize, isLoading: isLoadingMaxHeapSize } = useMaxHeapSize({
    disabled: !enabled,
    chainId,
    contractAddress: addresses?.maxHeap,
  });

  const { remainingVotesNeeded } = useQuorumVotesForPiece({
    contractAddress: cultureIndexContract,
    logicContractVersion: "v1",
    pieceId: cultureIndex?.topVotedPieceId ?? null,
    disabled: !enabled,
    chainId,
  });

  const { meetsQuorum } = useTopVotedPieceMeetsQuorum(cultureIndexContract, chainId, enabled);

  const { data: simulateData, error: prepareError } = useSimulateContract({
    address: contract,
    abi: auctionHouseAbi,
    functionName: "settleCurrentAndCreateNewAuction",
    chainId,
    query: { enabled },
  });

  const {
    writeContractAsync,
    isPending: isSettling,
    data: hash,
  } = useWriteContract({
    mutation: {
      onError: error => toast.error(getErrorMessage(error)),
      onSuccess: () => {
        onPending();
      },
    },
  });

  const {
    isLoading: isAwaitingTransaction,
    isSuccess,
    error,
  } = useWaitForTransaction({
    hash,
    chainId,
    onSuccess: async receipt => {
      try {
        toast.loading("Indexing settlement...", { duration: 60000, id: toastId });
        await storeTransactionEvent(receipt, chainId, {
          trackerType: "revolution_auction",
          contract,
          chainId,
        });
        onSuccess(receipt.transactionHash);
      } catch (e: any) {
        toast.error(getErrorMessage(e));
        reportWalletError(e, "settleAuction", contract, "settleCurrentAndCreateNewAuction");
      }
    },
  });

  useEffect(() => {
    if (!error) return;
    const message = reportWalletError(
      error,
      "settleAuction",
      contract,
      "settleCurrentAndCreateNewAuction",
    );
    toast.error(message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return {
    settleAuction: async () => {
      if (!isLoadingMaxHeapSize && (maxHeapSize || BigInt(0)) == BigInt(0)) {
        return toast.error(
          `${cultureIndex?.name || "The art race"} is currently empty. Please create an art piece before starting the next auction.`,
        );
      }
      if (!meetsQuorum) {
        return toast.error(
          `The top voted art piece does not meet a quorum of ${(cultureIndex?.quorumVotesBPS || 0) / 100}%. ${formatVotes(remainingVotesNeeded || 0, "revolution")} more votes needed. Please vote on more art pieces before starting the next auction.`,
          { duration: 12000 },
        );
      }
      if (prepareError) {
        return toast.error(getErrorMessage(prepareError));
      }

      if ((await checkWallet()) && writeContractAsync && simulateData?.request) {
        await writeContractAsync(simulateData.request);
      }
    },
    isSettling,
    isAwaitingTransaction,
    isSuccess,
    transactionHash: hash,
  };
};
