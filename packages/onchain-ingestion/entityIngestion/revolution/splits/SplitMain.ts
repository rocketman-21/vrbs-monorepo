import { OnchainEvent, EntityTracker } from "prisma-database";
import { decodeEventLog } from "viem";
import { splitMainAbi } from "@cobuild/splits";
import { createTopic0Switcher } from "../../../topicSwitcher";
import { EventProcessorResult, EventProcessor } from "../../../events/types";
import { database } from "@cobuild/database";
import { Split } from "prisma-database";

export const processSplitMainEvents: EventProcessor = async (
  entity: EntityTracker,
  event: OnchainEvent,
): Promise<EventProcessorResult> => {
  // Usage:
  const SplitsMainEvents = createTopic0Switcher<typeof splitMainAbi>(splitMainAbi);

  const decodeEventArgs = {
    abi: splitMainAbi,
    strict: true,
    data: event.data as `0x${string}`,
    topics: event.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
  } as const;

  switch (event.topics[0]) {
    case SplitsMainEvents.CreateSplit: {
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "CreateSplit" });
      console.debug("CreateSplit", args);

      const doc: Omit<Split, "id"> = {
        controller: args.controller.toLowerCase(),
        split: args.split.toLowerCase(),
        earned: "0",
        accounts: args.accounts.map(a => a.toLowerCase()),
        chainId: event.chainId,
        pointsData: {
          percentAllocations: args.pointsData.percentAllocations as number[],
          accounts: args.pointsData.accounts.map(a => a.toLowerCase()) as string[],
          pointsPercent: args.pointsData.pointsPercent,
        },
        splitMain: event.address.toLowerCase(),
        distributorFee: args.distributorFee,
        percentAllocations: args.percentAllocations as number[],
        createdAt: new Date(),
        name: "Untitled Split",
      };

      const split = await database.split.upsert({
        where: {
          chainId_split: { split: args.split.toLowerCase(), chainId: event.chainId },
        },
        update: doc,
        create: doc,
      });

      return split.split.toLowerCase();
    }

    case SplitsMainEvents.DistributeETH: {
      console.log("DistributeETH");
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "DistributeETH" });

      const split = await database.split.findFirst({
        where: { split: args.split.toLowerCase() },
      });

      if (!split) {
        throw new Error(`Split not found: ${args.split}`);
      }

      const alreadyEarned = BigInt(split.earned);

      await database.split.update({
        where: { chainId_split: { split: args.split.toLowerCase(), chainId: event.chainId } },
        data: {
          earned: (alreadyEarned + BigInt(args.amount)).toString(),
        },
      });

      return split.split.toLowerCase();
    }
  }
};
