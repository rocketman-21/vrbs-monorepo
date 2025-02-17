"use client";

import { useAccount } from "wagmi";
import { getErrorMessage } from "../utils/error";
import { useRevolutionConfig } from "./useRevolutionConfig";

export function useWalletError() {
  const { revolutionId } = useRevolutionConfig();
  const { address, chain } = useAccount();

  return {
    reportWalletError: (
      error: Error,
      type: any,
      contractAddress: `0x${string}`,
      functionName?: string,
    ) => {
      // Slack notification was here

      return getErrorMessage(error);
    },
  };
}
