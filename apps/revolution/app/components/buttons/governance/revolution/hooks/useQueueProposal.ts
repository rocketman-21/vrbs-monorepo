import { useCheckWallet } from "@cobuild/libs/hooks/useCheckWallet";
import { useWalletError } from "@cobuild/libs/hooks/useWalletError";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { revolutionDaoLogicV1Abi } from "@cobuild/revolution";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useWaitForTransaction } from "app/libs/useWaitForTransaction";
import { useRouter } from "next/navigation";
import { storeTransactionEvent } from "onchain-ingestion/functions/storeTransactionEvent";
import { useEffect, useState } from "react";
import { useSimulateContract, useWriteContract } from "wagmi";

export const useQueueProposal = (contract: `0x${string}`, chainId: number, proposalId: string) => {
  const { checkWallet, walletChain, connectedAddress } = useCheckWallet(chainId);
  const { reportWalletError } = useWalletError();
  const [toastId, setToastId] = useState("");
  const router = useRouter();

  const { data: simulateData, error: prepareError } = useSimulateContract({
    address: contract,
    abi: revolutionDaoLogicV1Abi,
    functionName: "queue",
    args: [BigInt(proposalId)],
    chainId,
    query: { enabled: chainId === walletChain?.id && !!connectedAddress },
  });

  const {
    writeContractAsync,
    isPending: isQueuing,
    data: hash,
  } = useWriteContract({
    mutation: {
      onError: error => toast.error(getErrorMessage(error)),
      onSuccess: () => {
        const id = toast.loading("Saving onchain...", { duration: 60000 });
        setToastId(id);
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
      toast.loading("Indexing queue txn...", { duration: 60000, id: toastId });
      await storeTransactionEvent(receipt, chainId, {
        trackerType: "revolution_dao_v1",
        contract,
        chainId,
      });
      toast.success("Proposal queued!", { id: toastId });
      router.refresh();
    },
  });

  useEffect(() => {
    if (!error) return;
    const message = reportWalletError(error, "queueProposal", contract, "queue");
    toast.error(message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return {
    queueProposal: async () => {
      if (prepareError) {
        return toast.error(getErrorMessage(prepareError));
      }

      if ((await checkWallet()) && writeContractAsync && simulateData?.request) {
        await writeContractAsync(simulateData.request);
      }
    },
    isQueuing,
    isAwaitingTransaction,
    isSuccess,
    transactionHash: hash,
  };
};
