import { useCheckWallet } from "@cobuild/libs/hooks/useCheckWallet";
import { useWalletError } from "@cobuild/libs/hooks/useWalletError";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { revolutionGrantsAbi } from "@cobuild/revolution";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useEffect } from "react";
import { useSimulateContract, useWriteContract } from "wagmi";
import { useWaitForTransaction } from "app/libs/useWaitForTransaction";

export const useRewriteVoteAllocations = (
  onSuccess: (hash: `0x${string}`) => void,
  chainId: number,
  recipients: `0x${string}`[][],
  voters: `0x${string}`[],
  allocations: number[][],
) => {
  const { checkWallet, walletChain, connectedAddress } = useCheckWallet(chainId);
  const { reportWalletError } = useWalletError();

  console.log({ voters, recipients, allocations });

  const { data: simulateData, error: prepareError } = useSimulateContract({
    address: "0x12e0c1bfddcbed42a4d4bc27e946ff3ead9b3dd5",
    abi: revolutionGrantsAbi,
    chainId,
    functionName: "adminSetVotesAllocations",
    args: [voters, recipients, allocations],
    query: {
      enabled: chainId === walletChain?.id && !!connectedAddress,
    },
  });

  const { writeContractAsync, isPending: isWriting, data: hash } = useWriteContract({});

  const {
    isLoading: isAwaitingTransaction,
    isSuccess,
    data,
    error: txnError,
  } = useWaitForTransaction({
    chainId,
    hash,
    onSuccess: async receipt => {
      onSuccess(receipt.transactionHash);
    },
  });

  useEffect(() => {
    if (!txnError) return;
    const message = reportWalletError(txnError, "deployRevolution", "0x", "deploy");
    toast.error(message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txnError]);

  return {
    deploy: async () => {
      if (prepareError) {
        console.log({ prepareError });
        return toast.error(getErrorMessage(prepareError));
      }

      if ((await checkWallet()) && writeContractAsync && simulateData?.request) {
        await writeContractAsync(simulateData.request);
      }
    },
    isWriting,
    isAwaitingTransaction,
    isSuccess,
    transactionHash: hash,
  };
};
