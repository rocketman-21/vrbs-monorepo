import { OnchainEvent, EntityTracker } from "prisma-database";
import { decodeEventLog } from "viem";
import { revolutionPointsEmitterAbi } from "@cobuild/revolution";
import { createTopic0Switcher } from "../../../topicSwitcher";
import { EventProcessorResult, EventProcessor } from "../../../events/types";
import { upsertPointsPurchase } from "./creators/upsertPointsPurchase";

export const processPointsEmitterEvents: EventProcessor = async (
  entity: EntityTracker,
  event: OnchainEvent,
): Promise<EventProcessorResult> => {
  // Usage:
  const PointsEmitterEvents = createTopic0Switcher<typeof revolutionPointsEmitterAbi>(
    revolutionPointsEmitterAbi,
  );

  const decodeEventArgs = {
    abi: revolutionPointsEmitterAbi,
    strict: true,
    data: event.data as `0x${string}`,
    topics: event.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
  } as const;

  switch (event.topics[0]) {
    case PointsEmitterEvents.PurchaseFinalized: {
      console.log("PurchaseFinalized");
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "PurchaseFinalized" });

      return await upsertPointsPurchase(args, event);
    }
  }
};
