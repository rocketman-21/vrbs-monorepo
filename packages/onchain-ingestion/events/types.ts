import { EntityTracker, OnchainEvent } from "prisma-database";

export type EventProcessorResult = string | undefined;

export type EventProcessor = (
  entity: EntityTracker,
  event: OnchainEvent,
) => Promise<EventProcessorResult>;
