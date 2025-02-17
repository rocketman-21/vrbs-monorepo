"use client";

import { getErrorMessage } from "@cobuild/libs/utils/error";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useEffect, useState } from "react";
import { TransactionReceipt } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";

type Params = {
  hash: `0x${string}` | undefined;
  chainId: number;
  onSuccess?: (receipt: TransactionReceipt) => void;
  onError?: (error: Error) => void;
};

export function useWaitForTransaction(params: Params) {
  const { onSuccess, hash, chainId, onError } = params;
  const [callbackCalled, setCallbackCalled] = useState(false);

  const { data, status, error, ...rest } = useWaitForTransactionReceipt({
    hash,
    chainId,
    confirmations: 1,
  });

  useEffect(() => {
    if (callbackCalled) return;
    switch (status) {
      case "success":
        onSuccess?.(data);
        setCallbackCalled(true);
        break;
      case "error":
        console.error(error);
        toast.error(getErrorMessage(error.message));
        onError?.(error);
        setCallbackCalled(true);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, callbackCalled]);

  return { data, status, error, ...rest };
}
