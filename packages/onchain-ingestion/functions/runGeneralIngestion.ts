import "server-only";

import { database } from "@cobuild/database";
import { EntityTrackers } from "@cobuild/database/models/eth/EntityTrackers";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { TrackerType } from "prisma-database";
import { EventProcessor, EventProcessorResult } from "../events/types";
import { sortOnchainEvents } from "../utils/eventUtils";
import { getEventProcessorByTrackerType } from "../utils/getEventProcessor";

export type GeneralIngestion = {
  contract: `0x${string}`;
  trackerType: TrackerType;
  chainId: number;
};

export async function runGeneralIngestionOndemand(
  ingestion: GeneralIngestion,
  transactionHash: `0x${string}`,
): Promise<EventProcessorResult> {
  const { contract: contractRaw, trackerType, chainId } = ingestion;
  const contract = contractRaw.toLowerCase() as `0x${string}`;

  //todo switch to using a unique id
  const [entity, events] = await Promise.all([
    EntityTrackers().getTrackerByTypeAndContractAddress(trackerType, contract),
    database.onchainEvent.findMany({ where: { transactionHash, chainId, address: contract } }),
  ]);

  if (events.length === 0) {
    throw new Error(`No events found for ${transactionHash} and ${contract} on chain ${chainId}`);
  }

  if (!entity) {
    throw new Error(`No entity found for ${trackerType} and ${contract}`);
  }

  const eventProcessor: EventProcessor = getEventProcessorByTrackerType(trackerType);

  console.debug(`Processing ${trackerType} events for ${contract} and ${events.length} events`);

  let slug: string | undefined;

  for (let event of sortOnchainEvents(events)) {
    if (!event.data) {
      console.error(`No data for event ${event.id}`);
      continue;
    }
    try {
      const tmpSlug = await eventProcessor(entity, event);
      if (tmpSlug) slug = tmpSlug;
    } catch (error) {
      console.error(error);
      console.error(`Error processing event ${event.id}: ${getErrorMessage(error)}`);

      throw error;
    }
  }

  return slug;
}
