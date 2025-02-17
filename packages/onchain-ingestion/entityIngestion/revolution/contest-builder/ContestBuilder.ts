import { contestBuilderAbi } from "@cobuild/revolution";
import { EntityTracker, OnchainEvent } from "prisma-database";
import { decodeEventLog } from "viem";
import { EventProcessor, EventProcessorResult } from "../../../events/types";
import { createTopic0Switcher } from "../../../topicSwitcher";
import { upsertContest } from "./creators/upsertContest";
import { upsertCultureIndex } from "./creators/upsertCultureIndex";

export const processContestBuilderEvents: EventProcessor = async (
  entity: EntityTracker,
  event: OnchainEvent,
): Promise<EventProcessorResult> => {
  // Usage:
  const ContestBuilderEvents = createTopic0Switcher<typeof contestBuilderAbi>(contestBuilderAbi);

  const decodeEventArgs = {
    abi: contestBuilderAbi,
    strict: true,
    data: event.data as `0x${string}`,
    topics: event.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
  } as const;

  switch (event.topics[0]) {
    case ContestBuilderEvents.CultureIndexDeployed: {
      console.log("CultureIndexDeployed");
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "CultureIndexDeployed" });

      return await upsertCultureIndex(args, event);
    }
    case ContestBuilderEvents.BaseContestDeployed: {
      console.log("BaseContestDeployed");
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "BaseContestDeployed" });

      await upsertCultureIndex(args, event);
      await upsertContest(args, event);

      return args.contest.toLowerCase();
    }
  }
};
