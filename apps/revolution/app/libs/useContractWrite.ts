"use client";

import { useCheckWallet } from "@cobuild/libs/hooks/useCheckWallet";
import { useWalletError } from "@cobuild/libs/hooks/useWalletError";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { getChain } from "@cobuild/libs/web3/utils";
import { getClient } from "@cobuild/libs/web3/viem/clients";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { EventProcessorResult } from "onchain-ingestion/events/types";
import { GeneralIngestion } from "onchain-ingestion/functions/runGeneralIngestion";
import { storeTransactionEvent } from "onchain-ingestion/functions/storeTransactionEvent";
import { useEffect, useMemo, useState } from "react";
import { PublicClient, WalletClient } from "viem";
import { useWaitForTransaction } from "./useWaitForTransaction";

interface Props {
  contract: `0x${string}`;
  chainId: number;
  type: any;
  trackerType?: GeneralIngestion["trackerType"];
  onSuccess?: (hash: string, ingestionResult?: EventProcessorResult) => Promise<any>;
  waitingText?: string;
  successText?: string;
}

export const useContractWrite = (props: Props) => {
  const { waitingText, successText, trackerType, onSuccess, type, contract, chainId } = props;
  const { reportWalletError } = useWalletError();
  const { walletConnector } = useDynamicContext();
  const [transactionHash, setTransactionHash] = useState<`0x${string}`>();
  const [status, setStatus] = useState<"idle" | "sending" | "pending">("idle");
  const { checkWallet, connectedAddress } = useCheckWallet(chainId);
  const [toastId, setToastId] = useState<string>("");

  const publicClient: PublicClient = useMemo(() => getClient(chainId), [chainId]);

  const { isSuccess, error } = useWaitForTransaction({
    hash: transactionHash,
    chainId,
    onSuccess: async receipt => {
      const id = toast.loading(waitingText || "Please wait...", { duration: 60000, id: toastId });
      setToastId(id);
      try {
        let ingestionResult: EventProcessorResult = undefined;
        if (trackerType) {
          ingestionResult = await storeTransactionEvent(receipt, chainId, {
            trackerType,
            contract,
            chainId,
          });
        }
        setStatus("idle");

        if (onSuccess) {
          await onSuccess(receipt.transactionHash, ingestionResult);
        }
        toast.success(successText || "Success!", { id, duration: 5000 });
        setTransactionHash(undefined);
      } catch (e: any) {
        setStatus("idle");
        toast.error(getErrorMessage(e), { id, duration: 5000 });
        reportWalletError(e, type, contract, type);
      }
    },
  });

  useEffect(() => {
    if (!error) return;
    const message = reportWalletError(error, type, contract, type);
    toast.error(message, { id: toastId, duration: 5000 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return {
    write: async (simulate: (client: PublicClient) => Promise<any>) => {
      try {
        setStatus("idle");
        setTransactionHash(undefined);
        setToastId("");

        if (!(await checkWallet())) {
          return;
        }

        if (!walletConnector || !publicClient || !connectedAddress) {
          reportWalletError(new Error("Missing wallet client"), type, contract, type);
          throw new Error("Reload page and try again");
        }

        const walletClient = walletConnector.getWalletClient<WalletClient>();

        setStatus("sending");

        const { request } = await simulate(publicClient);
        if (!request) throw new Error("Failed to prepare transaction");

        const hash = await walletClient.writeContract({
          ...request,
          account: connectedAddress,
          chain: getChain(chainId),
        });
        setStatus("pending");
        setToastId(toast.loading("Saving onchain...", { duration: 60000 }));
        setTransactionHash(hash);
      } catch (e: any) {
        console.error(e);
        setStatus("idle");
        setTransactionHash(undefined);
        reportWalletError(e, type, contract, type);
        return toast.error(getErrorMessage(e));
      }
    },
    isSuccess,
    transactionHash,
    status,
  };
};
