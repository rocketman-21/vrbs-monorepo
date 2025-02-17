import { OnchainEvent, EntityTracker } from "prisma-database";
import { decodeEventLog } from "viem";
import { cultureIndexAbi } from "@cobuild/revolution";
import { createTopic0Switcher } from "../../../topicSwitcher";
import { upsertCreation } from "./creators/getOrCreateCreation";
import { upsertCultureIndexVote } from "./creators/upsertVote";
import { EventProcessorResult, EventProcessor } from "../../../events/types";
import { generateOnchainPieceSubmissionSlug } from "@cobuild/database/models/revolution/submissions/set/createCreation";
import { database } from "@cobuild/database";
import { thatsGnarlyCultureIndexAbi } from "../../../web3/wagmi";

export const processCultureIndexEvents: EventProcessor = async (
  entity: EntityTracker,
  event: OnchainEvent,
): Promise<EventProcessorResult> => {
  // Usage:
  const CultureIndexEvents = createTopic0Switcher<typeof cultureIndexAbi>(cultureIndexAbi);
  const ThatsGnarlyCultureIndexEvents = createTopic0Switcher<typeof thatsGnarlyCultureIndexAbi>(
    thatsGnarlyCultureIndexAbi,
  );

  const decodeEventArgs = {
    abi: cultureIndexAbi,
    strict: true,
    data: event.data as `0x${string}`,
    topics: event.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
  } as const;

  switch (event.topics[0]) {
    // handle slightly dif event signature with tokenURI in the metadata
    case ThatsGnarlyCultureIndexEvents.PieceCreated: {
      console.log("Thats Gnarly - PieceCreated");
      const eventArgs = {
        abi: thatsGnarlyCultureIndexAbi,
        strict: true,
        data: event.data as `0x${string}`,
        topics: event.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
      } as const;
      const { args } = decodeEventLog({ ...eventArgs, eventName: "PieceCreated" });

      return await upsertCreation(args, event);
    }
    case CultureIndexEvents.PieceCreated: {
      console.log("PieceCreated");
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "PieceCreated" });

      return await upsertCreation(args, event);
    }
    case CultureIndexEvents.VoteCast: {
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "VoteCast" });

      return await upsertCultureIndexVote(args, event);
    }
    case CultureIndexEvents.PieceDropped: {
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "PieceDropped" });

      const slug = generateOnchainPieceSubmissionSlug(
        event.chainId,
        event.address as `0x${string}`,
        args.pieceId.toString(),
      );

      // update hasBeenDropped: true
      await database.submission.update({
        where: { slug },
        data: { hasBeenDropped: true },
      });
      break;
    }
  }
};
