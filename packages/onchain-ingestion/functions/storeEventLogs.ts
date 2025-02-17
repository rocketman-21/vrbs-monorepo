"use server";

import { reportApiError } from "@cobuild/libs/utils/apiError";
import { serialize } from "@cobuild/libs/utils/data";
import { kv } from "@vercel/kv";
import { Log } from "viem";
import { EventProcessorResult } from "../events/types";
import { saveEvents } from "../events/utils/bulkwriteEvents";
import { OnchainEvent } from "prisma-database";
import { GeneralIngestion, runGeneralIngestionOndemand } from "./runGeneralIngestion";

export async function storeEventLogs(
  logs: Log[],
  chainId: number,
  ingestion?: GeneralIngestion,
): Promise<EventProcessorResult> {
  try {
    if (logs.length === 0) return;

    const { transactionHash } = logs[0];
    if (!transactionHash) throw new Error("No transaction hash found in logs");

    const key = `store_event_logs:${transactionHash}`;

    if (await kv.get(key)) {
      console.debug(`Already processing ${transactionHash} event logs`);
      const waitTime = ingestion ? 3000 : 1000; // Let's wait until concurrent process is done
      return new Promise(resolve => setTimeout(resolve, waitTime));
    }

    await kv.set(key, true, { ex: 300 }); // Cleanup after 5 minutes

    await saveEvents(await logsToEvents(logs, chainId));

    if (ingestion) {
      return await runGeneralIngestionOndemand(ingestion, transactionHash);
    }

    return;
  } catch (error: any) {
    console.error(error);
    reportApiError(
      error,
      logs.map(log => serialize(log)),
      "store-event-logs",
    );
    throw new Error(error?.message || "Failed to index event logs");
  }
}

async function logsToEvents(logs: Log[], chainId: number) {
  return await Promise.all(logs.map(log => logToEvent(log, chainId)));
}

async function logToEvent(log: Log, chainId: number): Promise<Omit<OnchainEvent, "id">> {
  return {
    blockNumber: Number(log.blockNumber),
    chainId,
    logIndex: Number(log.logIndex),
    transactionIndex: Number(log.transactionIndex),
    address: log.address,
    blockHash: log.blockHash,
    createdAt: new Date(),
    ingestedOnDemand: true,
    data: log.data,
    removed: false,
    topics: log.topics,
    transactionHash: `${log.transactionHash}`,
    updatedAt: new Date(),
    decoded: null,
  };
}
