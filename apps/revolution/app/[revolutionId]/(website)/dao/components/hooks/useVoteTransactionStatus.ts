import { TrackerType } from "@cobuild/database/types";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useWaitForTransaction } from "app/libs/useWaitForTransaction";
import { useRouter } from "next/navigation";
import { storeTransactionEvent } from "onchain-ingestion/functions/storeTransactionEvent";

type UseTransactionStatusParams = {
  hash: string | undefined;
  chainId: number;
  contractAddress: `0x${string}`;
  trackerType: TrackerType;
};

type UseTransactionStatusReturn = {
  isSendingTransaction: boolean;
  isSuccess: boolean;
};

export function useVoteTransactionStatus({
  hash,
  chainId,
  contractAddress,
  trackerType,
}: UseTransactionStatusParams): UseTransactionStatusReturn {
  const router = useRouter();

  const { isLoading: isSendingTransaction, isSuccess } = useWaitForTransaction({
    hash: hash as `0x${string}`,
    chainId,
    onSuccess: async receipt => {
      const id = toast.loading("Indexing vote...");

      await storeTransactionEvent(receipt, chainId, {
        trackerType,
        contract: contractAddress,
        chainId,
      });
      toast.success("Successfully voted!", { id });

      router.refresh();
    },
  });

  return { isSendingTransaction, isSuccess };
}
