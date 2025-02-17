"use client";

import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";
import { CreateProfileArgs } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { useWalletError } from "@cobuild/libs/hooks/useWalletError";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { alloRegistry } from "@cobuild/libs/web3/allo/registry";
import { getChain } from "@cobuild/libs/web3/utils";
import { getClient } from "@cobuild/libs/web3/viem/clients";
import { alloRegistryAbi } from "@cobuild/libs/web3/wagmi";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useMemo, useState } from "react";
import { PublicClient, TransactionReceipt, WalletClient, decodeEventLog, zeroAddress } from "viem";
import { useAccount, useSwitchChain, useWaitForTransactionReceipt } from "wagmi";

export const useCreateAlloProfile = (chainId: number, toastId: string) => {
  const { switchChainAsync } = useSwitchChain();
  const { login } = useUser();
  const { reportWalletError } = useWalletError();
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
    confirmations: 1,
  });

  useEffect(() => {
    if (!error) return;
    const message = reportWalletError(error, "createAlloProfile", "0x", "createAlloProfileTxn");
    toast.error(message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return {
    createProfile: async (args: Omit<CreateProfileArgs, "nonce">) => {
      try {
        // login if not connected
        if (!account || !connectedChain) {
          return login();
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

        // set nonce as random number
        const nonce = BigInt(Math.floor(Math.random() * 1e15));

        if (!account) {
          throw new Error("Please connect your wallet");
        }

        if (args.owner === zeroAddress) {
          throw new Error("Please provide an owner address");
        }

        toast.loading("Creating profile...", { id: toastId });

        console.debug({ args, nonce });

        const txData: TransactionData = alloRegistry.createProfile({
          ...args,
          nonce,
        });

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

        // Send transaction
        const hash = await walletClient.sendTransaction({
          data: txData.data,
          to: txData.to,
          account,
          chain: getChain(chainId),
          value: BigInt(txData.value),
        });

        toast.loading("Saving onchain...", { id: toastId, duration: 20_000 });

        setTxnHash(hash);

        // Get the profile id from the transaction receipt
        let profileId = "";
        const transaction = await getTransactionReceiptWithRetry(hash, chainId);

        toast.success("Allo profile created!", { id: toastId });

        const { logs } = transaction;
        if (logs.length === 0) {
          throw new Error("No logs found in transaction receipt");
        }

        // loop over all the logs
        for (const log of logs) {
          try {
            if (log.address.toLowerCase() !== txData.to.toLowerCase()) continue;

            const decodedEvent = decodeEventLog({
              abi: alloRegistryAbi,
              ...log,
            });

            if (decodedEvent.eventName === "ProfileCreated") {
              profileId = (decodedEvent.args as any).profileId;
              break;
            }
          } catch (error) {
            console.error(error);
          }
        }

        if (!profileId) {
          throw new Error("Allo profile_id not found in transaction receipt");
        }

        toast.success("Allo profile created onchain!", { id: toastId });

        return profileId;
      } catch (error: any) {
        console.error(error);
        reportWalletError(error, "createAlloProfile", "0x", "createAlloProfile");
        toast.error(getErrorMessage(error, "Failed to create profile"), { id: toastId });
      }
    },

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
