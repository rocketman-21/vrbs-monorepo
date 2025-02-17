"use client";

import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { useWalletError } from "@cobuild/libs/hooks/useWalletError";
import { alloClient } from "@cobuild/libs/web3/allo/allo";
import { getChain } from "@cobuild/libs/web3/utils";
import { getClient } from "@cobuild/libs/web3/viem/clients";
import { alloV2Abi } from "@cobuild/libs/web3/wagmi";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useMemo, useState } from "react";
import { PublicClient, TransactionReceipt, WalletClient, decodeEventLog } from "viem";
import { useAccount, useSwitchChain, useWaitForTransactionReceipt } from "wagmi";

export const useFundAlloPool = (chainId: number, toastId: string) => {
  const { switchChainAsync } = useSwitchChain();
  const { login } = useUser();
  const { reportWalletError } = useWalletError();
  const [status, setStatus] = useState<"idle" | "sending" | "pending">("idle");
  const [txnHash, setTxnHash] = useState<`0x${string}`>();
  const { address: account, chain: connectedChain } = useAccount();
  const { walletConnector } = useDynamicContext();
  const publicClient: PublicClient = useMemo(() => getClient(chainId), [chainId]);

  const {
    isLoading: isAwaitingTransaction,
    isSuccess,
    error,
  } = useWaitForTransactionReceipt({
    hash: txnHash,
  });

  useEffect(() => {
    if (!error) return;
    const message = reportWalletError(error, "fundAlloPool", "0x", "fundAlloPoolTxn");
    toast.error(message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return {
    fundPool: async (
      poolId: number,
      amount: bigint,
    ): Promise<{ alloPoolId: string; amountAfterFee: bigint } | undefined> => {
      try {
        // login if not connected
        if (!account || !connectedChain) {
          login();
          return;
        }

        // check if all dependencies are loaded
        if (!switchChainAsync) {
          throw new Error("Reload page and try again");
        }

        // check if user is connected to the right network
        if (chainId !== connectedChain.id) {
          await switchChainAsync({ chainId });
          return;
        }

        if (!account) {
          throw new Error("Please connect your wallet");
        }

        toast.loading("Funding pool...", { id: toastId });

        const txData: TransactionData = alloClient.fundPool(BigInt(poolId), amount);

        if (!walletConnector || !publicClient || !account) {
          reportWalletError(
            new Error("Missing wallet client"),
            "createAlloPool",
            "0x",
            "createAlloClient",
          );
          throw new Error("Reload page and try again");
        }

        const walletClient = walletConnector.getWalletClient<WalletClient>();
        setStatus("sending");

        // Send transaction
        const hash = await walletClient.sendTransaction({
          data: txData.data,
          to: txData.to,
          account,
          chain: getChain(chainId),
          value: BigInt(amount),
        });
        setStatus("pending");

        toast.loading("Saving onchain...", { id: toastId, duration: 20_000 });

        setTxnHash(hash);

        // Get the profile id from the transaction receipt
        let alloPoolId = "";
        let amountAfterFee = BigInt(0);
        const transaction = await getTransactionReceiptWithRetry(hash, chainId);

        toast.success("Allo pool funded!", { id: toastId, duration: 2500 });
        setStatus("idle");

        const { logs } = transaction;
        if (logs.length === 0) {
          toast.error("No logs found in transaction receipt");
          return;
        }

        // loop over all the logs
        for (const log of logs) {
          if (log.address.toLowerCase() !== alloClient.address().toLowerCase()) continue;

          const decodedEvent = decodeEventLog({
            abi: alloV2Abi,
            ...log,
          });

          if (decodedEvent.eventName === "PoolFunded" && decodedEvent.args.poolId) {
            alloPoolId = decodedEvent.args.poolId.toString();
            amountAfterFee = decodedEvent.args.amount;
            break;
          }
        }

        if (!alloPoolId) {
          throw new Error("Allo poolId not found in transaction receipt");
        }

        return { alloPoolId, amountAfterFee };
      } catch (error: any) {
        setStatus("idle");
        console.error(error);
        reportWalletError(error, "fundAlloPool", "0x", "fundAlloPool");
        throw new Error(error.message || "Failed to fund pool");
      }
    },
    status,
    isAwaitingTransaction,
    isSuccess,
  };
};

const getTransactionReceiptWithRetry = async (
  hash: `0x${string}`,
  chainId: number,
  retries = 3,
): Promise<TransactionReceipt> => {
  try {
    const publicClient = getClient(chainId);

    return await publicClient.waitForTransactionReceipt({ hash });
  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    return getTransactionReceiptWithRetry(hash, retries - 1);
  }
};
