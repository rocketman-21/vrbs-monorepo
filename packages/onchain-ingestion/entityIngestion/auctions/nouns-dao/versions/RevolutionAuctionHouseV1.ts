import { auctionHouseAbi } from "@cobuild/revolution";
import { EntityTracker, OnchainEvent } from "prisma-database";
import { decodeEventLog } from "viem";
import { revolutionAuctionTokenContract } from "../../../../contractValidity/nouns/auctionTokenContract";
import { EventProcessorResult, EventProcessor } from "../../../../events/types";
import { createTopic0Switcher } from "../../../../topicSwitcher";
import { addAuctionBidEvent } from "../creators/addAuctionBid";
import { getOrCreateAuction } from "../creators/getOrCreateAuction";
import { handleAuctionExtended } from "../handlers/auctionExtended";
import { handleAuctionSettled } from "../handlers/auctionSettled";
import { handleCreatorRateBpsUpdated } from "../handlers/creatorRateBpsUpdated";
import { handleEntropyRateBpsUpdated } from "../handlers/entropyRateBpsUpdated";
import { handleMinBidUpdated } from "../handlers/minBidIncrementUpdated";
import { handleReservePriceUpdated } from "../handlers/reservePriceUpdated";
import { handleTimeBufferUpdated } from "../handlers/timeBufferUpdated";
import { handleManifestoUpdated } from "../handlers/manifestoUpdated";

export const processRevolutionAuctionEvent: EventProcessor = async (
  entity: EntityTracker,
  event: OnchainEvent,
): Promise<EventProcessorResult> => {
  const RevolutionAuctionHouseEventsTopics =
    createTopic0Switcher<typeof auctionHouseAbi>(auctionHouseAbi);

  const tokenContractAddress =
    ((entity.details as any)?.tokenContract as string) ||
    (await revolutionAuctionTokenContract(
      entity.chainId,
      event.address.toLowerCase() as `0x${string}`,
      entity.id,
    ));

  if (!tokenContractAddress) {
    throw new Error(`No token contract address found: ${JSON.stringify({ entity, event })}`);
  }

  const decodeEventArgs = {
    abi: auctionHouseAbi,
    strict: true,
    data: event.data as `0x${string}`,
    topics: event.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
  } as const;

  switch (event.topics[0]) {
    case RevolutionAuctionHouseEventsTopics.AuctionCreated: {
      console.log("auction created");
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "AuctionCreated" });

      const auction = await getOrCreateAuction(
        {
          tokenId: args.tokenId,
          startTime: args.startTime,
          endTime: args.endTime,
        },
        entity.id,
        event,
        tokenContractAddress,
        "revolution",
      );
      return auction.uniqueId;
    }
    case RevolutionAuctionHouseEventsTopics.AuctionBid: {
      console.log("auction bid");
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "AuctionBid" });
      await addAuctionBidEvent(
        {
          tokenId: args.tokenId,
          sender: args.sender,
          bidder: args.bidder,
          value: args.value,
          extended: false,
        },
        event,
        tokenContractAddress,
      );
      break;
    }
    case RevolutionAuctionHouseEventsTopics.AuctionSettled: {
      console.log("AuctionSettled");
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "AuctionSettled" });
      await handleAuctionSettled(
        {
          tokenId: args.tokenId,
          winner: args.winner,
          amount: args.amount,
          pointsPaidToCreators: args.pointsPaidToCreators,
          ethPaidToCreators: args.ethPaidToCreators,
        },
        event,
        tokenContractAddress,
      );
      break;
    }
    case RevolutionAuctionHouseEventsTopics.AuctionExtended: {
      console.log("auction extended");
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "AuctionExtended" });
      await handleAuctionExtended(
        {
          tokenId: args.tokenId,
          endTime: args.endTime,
        },
        event,
        tokenContractAddress,
      );
      break;
    }
    case RevolutionAuctionHouseEventsTopics.AuctionReservePriceUpdated: {
      console.log("vote cast");
      const decoded = decodeEventLog({
        ...decodeEventArgs,
        eventName: "AuctionReservePriceUpdated",
      });
      await handleReservePriceUpdated(decoded.args, event);
      break;
    }
    case RevolutionAuctionHouseEventsTopics.AuctionMinBidIncrementPercentageUpdated: {
      console.log("AuctionMinBidIncrementPercentageUpdated");
      const decoded = decodeEventLog({
        ...decodeEventArgs,
        eventName: "AuctionMinBidIncrementPercentageUpdated",
      });
      await handleMinBidUpdated(decoded.args, event);
      break;
    }
    case RevolutionAuctionHouseEventsTopics.AuctionTimeBufferUpdated: {
      console.log("auction time buffer updated");
      const decoded = decodeEventLog({ ...decodeEventArgs, eventName: "AuctionTimeBufferUpdated" });

      await handleTimeBufferUpdated(decoded.args, event);
      break;
    }
    case RevolutionAuctionHouseEventsTopics.CreatorRateBpsUpdated: {
      console.log("creator rate bps updated");
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "CreatorRateBpsUpdated" });
      await handleCreatorRateBpsUpdated(args, event);
      break;
    }
    case RevolutionAuctionHouseEventsTopics.EntropyRateBpsUpdated: {
      console.log("entropy rate bps updated");
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "EntropyRateBpsUpdated" });
      await handleEntropyRateBpsUpdated(args, event);
      break;
    }
    case RevolutionAuctionHouseEventsTopics.ManifestoUpdated: {
      console.log("manifesto updated");
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "ManifestoUpdated" });
      await handleManifestoUpdated(args, event, tokenContractAddress);
      break;
    }
    case RevolutionAuctionHouseEventsTopics.Paused: {
      console.log("auction paused");
      break;
    }
    case RevolutionAuctionHouseEventsTopics.Unpaused: {
      console.log("auction unpaused");
      break;
    }
  }
};
