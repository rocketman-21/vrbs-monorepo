"use server";

import { reportApiError } from "@cobuild/libs/utils/apiError";
import { serialize } from "@cobuild/libs/utils/data";
import { TransactionReceipt } from "viem";
import { EventProcessorResult } from "../events/types";
import { GeneralIngestion } from "./runGeneralIngestion";
import { storeEventLogs } from "./storeEventLogs";

export async function storeTransactionEvent(
  receipt: TransactionReceipt,
  chainId: number,
  ingestion?: GeneralIngestion,
): Promise<EventProcessorResult> {
  try {
    const { logs, status, transactionHash } = receipt;
    console.debug(`Storing transaction events for ${transactionHash} (${status})`);

    if (status === "reverted") return;

    return await storeEventLogs(logs, chainId, ingestion);
  } catch (error: any) {
    console.error(error);
    reportApiError(error, serialize(receipt), "store-transaction-event");
    throw new Error(error?.message || "Failed to index event logs");
  }
}
