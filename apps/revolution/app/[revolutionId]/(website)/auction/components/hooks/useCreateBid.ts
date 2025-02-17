"use client";

import { useUser } from "@cobuild/libs/hooks/useUser";
import { useWalletError } from "@cobuild/libs/hooks/useWalletError";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { createRelayClient } from "@cobuild/libs/web3/relay/client";
import { getChain } from "@cobuild/libs/web3/utils";
import { getClient } from "@cobuild/libs/web3/viem/clients";
import { auctionHouseAbi } from "@cobuild/revolution";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRevolution } from "app/libs/useRevolution";
import { useWaitForTransaction } from "app/libs/useWaitForTransaction";
import { storeTransactionEvent } from "onchain-ingestion/functions/storeTransactionEvent";
import { useEffect, useMemo, useState } from "react";
import { WalletClient, zeroAddress } from "viem";
import { useAccount, useSwitchChain } from "wagmi";
import { revalidateAuction } from "../revalidateAuction";

export const useCreateBid = (args: {
  contract: `0x${string}`;
  fromChainId: number;
  chainId: number;
  tokenId: string;
  bidAmount: bigint;
  isPaused: boolean;
  minBid: bigint;
  onSuccess: (transactionHash: `0x${string}`) => void;
}) => {
  const { contract, fromChainId, chainId, tokenId, bidAmount, isPaused, onSuccess, minBid } = args;
  const { revolutionId } = useRevolution();
  const { reportWalletError } = useWalletError();
  const { walletConnector } = useDynamicContext();
  const { address: connectedAddress, isConnected, chain: connectedChain } = useAccount();
  const [transactionHash, setTransactionHash] = useState<`0x${string}`>();
  const [status, setStatus] = useState<"idle" | "sending" | "pending">("idle");
  const [toastId, setToastId] = useState<string>("");
  const { switchChainAsync } = useSwitchChain();
  const { login, user } = useUser();
  const relayClient = useMemo(() => createRelayClient(chainId), [chainId]);

  const { isSuccess, error } = useWaitForTransaction({
    hash: transactionHash,
    chainId,
    onSuccess: async receipt => {
      try {
        const id = toast.loading("Indexing bid...", { duration: 60000, id: toastId });
        await storeTransactionEvent(receipt, chainId, {
          trackerType: "revolution_auction",
          contract,
          chainId,
        });
        await revalidateAuction(revolutionId);
        setStatus("idle");
        toast.success("Bid created!", { id, duration: 5000 });
        onSuccess(receipt.transactionHash);
      } catch (e: any) {
        setStatus("idle");
        toast.error(getErrorMessage(e));
        reportWalletError(e, "createBid", contract, "createBid");
      }
    },
  });

  useEffect(() => {
    if (!error) return;
    const message = reportWalletError(error, "createBid", contract, "createBid");
    toast.error(message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return {
    isConnected,
    isOnCorrectNetwork: isConnected && fromChainId === connectedChain?.id,

    createBid: async () => {
      try {
        setStatus("idle");
        setTransactionHash(undefined);
        setToastId("");

        const publicClient = getClient(fromChainId);

        if (!connectedAddress || !connectedChain || !user) return login();

        if (!walletConnector || !publicClient || !switchChainAsync) {
          throw new Error("Reload page and try again");
        }

        if (fromChainId !== connectedChain.id) {
          await switchChainAsync({ chainId: fromChainId });
          return;
        }

        if (isPaused) throw new Error("This auction is paused");
        if (bidAmount <= 0) throw new Error("Incorrect bid amount");
        if (bidAmount < minBid) throw new Error("Bid amount is too low");

        const walletClient = walletConnector.getWalletClient<WalletClient>();

        setStatus("sending");

        const { request } = await publicClient.simulateContract({
          address: contract,
          abi: auctionHouseAbi,
          functionName: "createBid",
          args: [BigInt(tokenId), connectedAddress, zeroAddress],
          value: bidAmount,
          chain: getChain(fromChainId),
          account: connectedAddress,
        });

        if (!request) throw new Error("Failed to prepare transaction");

        if (fromChainId === chainId) {
          console.debug("Direct transaction");
          const hash = await walletClient.writeContract({
            ...request,
            account: connectedAddress,
            chain: getChain(chainId),
          });
          setStatus("pending");
          setToastId(toast.loading("Saving onchain...", { duration: 60000 }));
          setTransactionHash(hash);
        } else {
          console.debug("Transaction with Relay");
          await relayClient.actions.call({
            chainId: fromChainId,
            toChainId: chainId,
            txs: [request as any],
            wallet: walletClient,
            onProgress: steps => {
              try {
                if (!steps.length || !steps[0].items) return;
                const hashes = steps[0].items[0].txHashes;

                // There is transaction hash, so we know user approved the transaction
                if (hashes) setStatus("pending");

                const finalTransaction = hashes?.filter(h => h.chainId === chainId)[0];
                // We have the transaction hash on the destination chain, can pass it to useWaitForTransactionReceipt for ingestion
                if (finalTransaction) setTransactionHash(finalTransaction?.txHash);
              } catch {}
            },
          });
        }
      } catch (e: any) {
        setStatus("idle");
        setTransactionHash(undefined);
        reportWalletError(e, "createBid", contract, "createBid");
        return toast.error(getErrorMessage(e));
      }
    },
    isSuccess,
    transactionHash,
    status,
  };
};
