"use client";

import { useCheckWallet } from "@cobuild/libs/hooks/useCheckWallet";
import { nounsBuilderGovernorV1Abi } from "@cobuild/libs/web3/wagmi";
import { useWaitForTransaction } from "app/libs/useWaitForTransaction";
import { Transaction } from "prisma-database";
import { useMemo, useState } from "react";
import { getAddress, parseEther } from "viem";
import { useWriteContract } from "wagmi";
import { WriteContractReturnType } from "wagmi/actions";

interface Props {
  address: `0x${string}`;
  chainId: number;
  transactions: Transaction[];
  proposal: string;
  onSuccess: (transactionHash: `0x${string}`) => void;
  onError: (error: Error & { shortMessage?: string }) => void;
  onPendingTransaction?: () => void;
}

type Status = "idle" | "processing" | "success" | "error";

type Response = {
  propose: () => Promise<WriteContractReturnType | undefined>;
  status: Status;
  transactionHash?: `0x${string}`;
};

export const useCreateProposalNounsBuilder = (props: Props): Response => {
  const { address, onSuccess, onError, proposal, transactions, chainId, onPendingTransaction } =
    props;

  const [status, setStatus] = useState<Status>("idle");

  const { checkWallet } = useCheckWallet(chainId);

  const { targets, values, calldatas } = useMemo(
    () =>
      transactions.reduce(
        (acc, transaction) => {
          return {
            targets: [...acc.targets, getAddress(transaction.target)],
            values: [...acc.values, parseEther(transaction.amount.toString())],
            calldatas: [...acc.calldatas, "0x" as const],
          };
        },
        {
          targets: [] as `0x${string}`[],
          values: [] as bigint[],
          calldatas: [] as `0x${string}`[],
        },
      ),
    [transactions],
  );

  const { data: hash, writeContractAsync } = useWriteContract({
    mutation: {
      onError: (error: any) => {
        setStatus("error");
        onError(error);
      },
      onSuccess: () => {
        onPendingTransaction && onPendingTransaction();
        setStatus("processing");
      },
    },
  });

  useWaitForTransaction({
    hash,
    chainId,
    onError: error => {
      setStatus("error");
      onError(error);
    },
    onSuccess: data => {
      setStatus("success");
      onSuccess(data.transactionHash);
    },
  });

  return {
    propose: async () => {
      if (await checkWallet())
        return writeContractAsync({
          args: [targets, values, calldatas, proposal],
          abi: nounsBuilderGovernorV1Abi,
          address: getAddress(address),
          functionName: "propose",
          chainId,
        });
    },
    status,
    transactionHash: hash,
  };
};
