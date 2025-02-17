import { OnchainEvent, EntityTracker } from "prisma-database";
import { decodeEventLog } from "viem";
import { nounsAuctionHouseAbi } from "../../../../web3/wagmi";
import { getOrCreateAuction } from "../creators/getOrCreateAuction";
import { addAuctionBidEvent } from "../creators/addAuctionBid";
import { handleAuctionSettled } from "../handlers/auctionSettled";
import { handleAuctionExtended } from "../handlers/auctionExtended";
import { handleReservePriceUpdated } from "../handlers/reservePriceUpdated";
import { handleMinBidUpdated } from "../handlers/minBidIncrementUpdated";
import { handleTimeBufferUpdated } from "../handlers/timeBufferUpdated";
import { createTopic0Switcher } from "../../../../topicSwitcher";
import { nounsAuctionTokenContract } from "../../../../contractValidity/nouns/auctionTokenContract";
import { EventProcessorResult, EventProcessor } from "../../../../events/types";

export const processNounsAuctionEvent: EventProcessor = async (
  entity: EntityTracker,
  event: OnchainEvent,
): Promise<EventProcessorResult> => {
  const NounsAuctionHouseEventsTopics =
    createTopic0Switcher<typeof nounsAuctionHouseAbi>(nounsAuctionHouseAbi);

  const tokenContractAddress =
    ((entity.details as any)?.tokenContract as string) ||
    (await nounsAuctionTokenContract(
      entity.chainId,
      event.address.toLowerCase() as `0x${string}`,
      entity.id,
    ));

  if (!tokenContractAddress) {
    return;
  }

  const decodeEventArgs = {
    abi: nounsAuctionHouseAbi,
    strict: true,
    data: event.data as `0x${string}`,
    topics: event.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
  } as const;

  switch (event.topics[0]) {
    case NounsAuctionHouseEventsTopics.AuctionCreated: {
      console.log("auction created");
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "AuctionCreated" });

      const auction = await getOrCreateAuction(
        { ...args, tokenId: args.nounId },
        entity.id,
        event,
        tokenContractAddress,
        "nouns",
      );
      return auction.uniqueId;
    }
    case NounsAuctionHouseEventsTopics.AuctionBid: {
      console.log("auction bid");
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "AuctionBid" });
      await addAuctionBidEvent(
        { ...args, tokenId: args.nounId, bidder: args.sender },
        event,
        tokenContractAddress,
      );
      break;
    }
    case NounsAuctionHouseEventsTopics.AuctionSettled: {
      console.log("AuctionSettled");
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "AuctionSettled" });
      await handleAuctionSettled(
        {
          ...args,
          tokenId: args.nounId,
          ethPaidToCreators: BigInt(0),
          pointsPaidToCreators: BigInt(0),
        },
        event,
        tokenContractAddress,
      );
      break;
    }
    case NounsAuctionHouseEventsTopics.AuctionExtended: {
      console.log("auction extended");
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "AuctionExtended" });
      await handleAuctionExtended({ ...args, tokenId: args.nounId }, event, tokenContractAddress);
      break;
    }
    case NounsAuctionHouseEventsTopics.AuctionReservePriceUpdated: {
      console.log("vote cast");
      const { args } = decodeEventLog({
        ...decodeEventArgs,
        eventName: "AuctionReservePriceUpdated",
      });
      await handleReservePriceUpdated(args, event);
      break;
    }
    case NounsAuctionHouseEventsTopics.AuctionMinBidIncrementPercentageUpdated: {
      console.log("AuctionMinBidIncrementPercentageUpdated");
      const { args } = decodeEventLog({
        ...decodeEventArgs,
        eventName: "AuctionMinBidIncrementPercentageUpdated",
      });
      await handleMinBidUpdated(args, event);
      break;
    }
    case NounsAuctionHouseEventsTopics.AuctionTimeBufferUpdated: {
      console.log("auction time buffer updated");
      const { args } = decodeEventLog({
        ...decodeEventArgs,
        eventName: "AuctionTimeBufferUpdated",
      });
      await handleTimeBufferUpdated(args, event);
      break;
    }
    case NounsAuctionHouseEventsTopics.Paused: {
      console.log("auction paused");
      break;
    }
    case NounsAuctionHouseEventsTopics.Unpaused: {
      console.log("auction unpaused");
      break;
    }
  }
};
