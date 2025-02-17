"use client";

import { deleteCacheResult } from "@cobuild/libs/cache";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { isEthAddress } from "@cobuild/libs/utils/account";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { createRelayClient } from "@cobuild/libs/web3/relay/client";
import { getChain } from "@cobuild/libs/web3/utils";
import { getClient } from "@cobuild/libs/web3/viem/clients";
import { revolutionPointsEmitterAbi as abi } from "@cobuild/revolution";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRevolution } from "app/libs/useRevolution";
import { useWaitForTransaction } from "app/libs/useWaitForTransaction";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { WalletClient, zeroAddress } from "viem";
import { useAccount, useContractReads, useSwitchChain } from "wagmi";

export const useBuyPoints = (args: {
  amount: bigint;
  addresses: `0x${string}`[];
  bpsSplits: bigint[];
  fromChainId: number;
  chainId: number;
  onSuccess: (hash: string) => void;
  enabled: boolean;
}) => {
  const { amount, onSuccess, enabled, addresses, bpsSplits, fromChainId, chainId } = args;
  const { addresses: revolutionAddresses, revolutionId } = useRevolution();
  const { address: connectedAddress, isConnected, chain: connectedChain } = useAccount();
  const { walletConnector } = useDynamicContext();
  const router = useRouter();
  const [transactionHash, setTransactionHash] = useState<`0x${string}`>();
  const [toastId, setToastId] = useState("");
  const { login, user } = useUser();
  const { switchChainAsync } = useSwitchChain();
  const [status, setStatus] = useState<"idle" | "sending" | "pending">("idle");
  const relayClient = useMemo(() => createRelayClient(chainId), [chainId]);

  const contract = { address: revolutionAddresses?.pointsEmitter, abi, chainId };

  const { data: quote, isLoading: isQuoteLoading } = useContractReads({
    contracts: [
      { ...contract, functionName: "paused" },
      { ...contract, functionName: "decimals" },
      { ...contract, functionName: "getTokenQuoteForPayment", args: [amount] },
    ],
    query: {
      enabled: !!contract.address && enabled,
      select: data => {
        const [paused, decimals, quote] = data;
        const isPaused = paused.status === "success" && paused.result;
        const points =
          quote.status === "success" && !isPaused
            ? Number(quote.result) / 10 ** Number(decimals.result)
            : 0;
        return { isPaused, points };
      },
    },
  });

  const {
    isLoading: isAwaitingTransaction,
    error: txnError,
    isSuccess,
  } = useWaitForTransaction({
    chainId,
    hash: transactionHash,
    onSuccess: async receipt => {
      await deleteCacheResult(`votingPower_${user}_${revolutionId}`);
      await deleteCacheResult(`governancePower_${user}_${revolutionId}`);
      toast.success("Success! 🎉", { id: toastId, duration: 3000 });
      onSuccess(receipt.transactionHash);
      setStatus("idle");
      setTransactionHash(undefined);
      setToastId("");
      router.refresh();
    },
  });

  useEffect(() => {
    if (!txnError || !contract.address) return;
    toast.error(getErrorMessage(txnError));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txnError]);

  return {
    isOnCorrectNetwork: isConnected && fromChainId === connectedChain?.id,

    buyPoints: async () => {
      try {
        setTransactionHash(undefined);
        setToastId("");
        setStatus("idle");

        const publicClient = getClient(fromChainId);

        // login if not connected
        if (!connectedAddress || !connectedChain || !user) return login();

        // check if all dependencies are loaded
        if (!walletConnector || !publicClient || !switchChainAsync) {
          throw new Error("Reload page and try again");
        }

        // check if user is connected to the right network
        if (fromChainId !== connectedChain.id) {
          await switchChainAsync({ chainId: fromChainId });
          return;
        }

        // check inputs
        if (amount <= 0) throw new Error("Purchase value too low");
        if (quote?.isPaused) throw new Error("Purchases are paused");
        if (!addresses.every(isEthAddress)) {
          toast.error("Invalid recipient's address");
          throw new Error("Invalid recipient's address");
        }

        const walletClient = walletConnector.getWalletClient<WalletClient>();

        setStatus("sending");

        // construct transaction
        const { request } = await publicClient.simulateContract({
          abi,
          chain: getChain(fromChainId),
          address: revolutionAddresses?.pointsEmitter as `0x${string}`,
          functionName: "buyToken",
          args: [
            addresses,
            bpsSplits,
            {
              builder: zeroAddress,
              deployer: zeroAddress,
              purchaseReferral: zeroAddress,
            },
          ],
          value: amount,
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
                // We have the transaction hash on the destination chain, can pass it to useWaitForTransaction for ingestion
                if (finalTransaction) setTransactionHash(finalTransaction?.txHash);
              } catch {}
            },
          });
        }
      } catch (e: any) {
        setStatus("idle");
        setTransactionHash(undefined);
        toast.error(getErrorMessage(e));
        console.error(e);
      }
    },
    quote: {
      points: quote?.points || 0,
      isLoading: isQuoteLoading,
    },
    isAwaitingTransaction,
    status,
    isSuccess,
    transactionHash,
  };
};
