"use client";

import { useCheckWallet } from "@cobuild/libs/hooks/useCheckWallet";
import { revolutionDaoLogicV1Abi } from "@cobuild/revolution";
import { useWaitForTransaction } from "app/libs/useWaitForTransaction";
import { Transaction } from "prisma-database";
import { useMemo, useState } from "react";
import { encodeAbiParameters, getAddress, parseAbiParameters, parseEther } from "viem";
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
  transactionHash?: string;
};

export const useCreateProposalRevolution = (props: Props): Response => {
  const { address, onSuccess, onError, proposal, transactions, chainId, onPendingTransaction } =
    props;

  const [status, setStatus] = useState<Status>("idle");

  const { checkWallet } = useCheckWallet(chainId);

  const { targets, values, signatures, calldatas } = useMemo(
    () =>
      transactions.reduce(
        (acc, transaction) => {
          const { calldata, signature, target, value } = getFunctionDataForTransaction(transaction);
          return {
            targets: [...acc.targets, target],
            values: [...acc.values, value],
            signatures: [...acc.signatures, signature],
            calldatas: [...acc.calldatas, calldata],
          };
        },
        {
          targets: [] as `0x${string}`[],
          values: [] as bigint[],
          signatures: [] as string[],
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
          args: [targets, values, signatures, calldatas, proposal],
          abi: revolutionDaoLogicV1Abi,
          address: getAddress(address),
          functionName: "propose",
          chainId,
        });
    },
    status,
    transactionHash: hash,
  };
};

function getFunctionDataForTransaction(transaction: Transaction) {
  const { contractAddress, amount, target, symbol } = transaction;

  switch (contractAddress) {
    // Send USDC
    case "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48":
      return {
        target: contractAddress,
        value: BigInt(0),
        calldata: encodeAbiParameters(parseAbiParameters("address,uint256"), [
          getAddress(target),
          BigInt(amount * 10 ** 6), // 6 decimals
        ]),
        signature: "transfer(address,uint256)",
      };
    default:
      if (symbol === "ETH") {
        return {
          target: getAddress(target),
          calldata: "0x" as const,
          signature: "",
          value: parseEther(amount.toString()),
        };
      } else {
        console.debug({ transaction });
        throw new Error("Transaction not supported!");
      }
  }
}
