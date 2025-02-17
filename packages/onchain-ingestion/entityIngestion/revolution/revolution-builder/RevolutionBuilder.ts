import { OnchainEvent, EntityTracker } from "prisma-database";
import { decodeEventLog } from "viem";
import { revolutionBuilderAbi } from "@cobuild/revolution";
import { createTopic0Switcher } from "../../../topicSwitcher";
import { EventProcessorResult, EventProcessor } from "../../../events/types";
import { upsertCultureIndex } from "./creators/upsertCultureIndex";

export const processRevolutionBuilderEvents: EventProcessor = async (
  entity: EntityTracker,
  event: OnchainEvent,
): Promise<EventProcessorResult> => {
  // Usage:
  const RevolutionBuilderEvents =
    createTopic0Switcher<typeof revolutionBuilderAbi>(revolutionBuilderAbi);

  const decodeEventArgs = {
    abi: revolutionBuilderAbi,
    strict: true,
    data: event.data as `0x${string}`,
    topics: event.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
  } as const;

  switch (event.topics[0]) {
    case RevolutionBuilderEvents.CultureIndexDeployed: {
      console.log("CultureIndexDeployed");
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "CultureIndexDeployed" });

      return await upsertCultureIndex(args, event);
    }
  }
};
