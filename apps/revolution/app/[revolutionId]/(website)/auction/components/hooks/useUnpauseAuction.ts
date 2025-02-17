import { useCheckWallet } from "@cobuild/libs/hooks/useCheckWallet";
import { useWalletError } from "@cobuild/libs/hooks/useWalletError";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { useMaxHeapSize } from "@cobuild/libs/web3/revolution/useMaxHeapSize";
import { auctionHouseAbi } from "@cobuild/revolution";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useRevolution } from "app/libs/useRevolution";
import { useWaitForTransaction } from "app/libs/useWaitForTransaction";
import { storeTransactionEvent } from "onchain-ingestion/functions/storeTransactionEvent";
import { useEffect } from "react";
import { useReadContract, useSimulateContract, useWriteContract } from "wagmi";

export const useUnpauseAuction = (
  contract: `0x${string}`,
  chainId: number,
  onSuccess: (hash: string) => void,
) => {
  const { checkWallet, connectedAddress } = useCheckWallet(chainId);
  const { cultureIndex, addresses } = useRevolution();
  const { reportWalletError } = useWalletError();

  const { data: simulateData, error: prepareError } = useSimulateContract({
    address: contract,
    abi: auctionHouseAbi,
    functionName: "unpause",
    chainId,
  });

  const { size: maxHeapSize, isLoading: isLoadingMaxHeapSize } = useMaxHeapSize({
    chainId,
    contractAddress: addresses?.maxHeap,
  });

  const { data: owner } = useReadContract({
    abi: auctionHouseAbi,
    address: contract,
    chainId,
    functionName: "owner",
  });

  const {
    writeContractAsync,
    isPending: isUnpausing,
    data: hash,
  } = useWriteContract({ mutation: { onError: error => toast.error(getErrorMessage(error)) } });

  const {
    isLoading: isAwaitingTransaction,
    isSuccess,
    error,
  } = useWaitForTransaction({
    hash,
    chainId,
    onSuccess: async receipt => {
      await storeTransactionEvent(receipt, chainId, {
        trackerType: "revolution_auction",
        contract,
        chainId,
      });
      onSuccess(receipt.transactionHash);
    },
  });

  useEffect(() => {
    if (!error) return;
    const message = reportWalletError(error, "unpause", contract, "unpause");
    toast.error(message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return {
    unpauseAuction: async () => {
      if (!isLoadingMaxHeapSize && (maxHeapSize || BigInt(0)) == BigInt(0)) {
        return toast.error(
          `${cultureIndex?.name || "The art race"} is currently empty. Please create an art piece before unpausing the auction.`,
        );
      }
      if (prepareError) {
        return toast.error(getErrorMessage(prepareError));
      }

      if ((await checkWallet()) && writeContractAsync && simulateData?.request) {
        await writeContractAsync(simulateData.request);
      }
    },
    isUnpausing,
    isAwaitingTransaction,
    isSuccess,
    owner,
    isOwner: owner?.toLowerCase() === connectedAddress?.toLowerCase(),
    transactionHash: hash,
  };
};
