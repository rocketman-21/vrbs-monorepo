import { OnchainEvent, EntityTracker } from "prisma-database";
import { decodeEventLog } from "viem";
import { skateContractV2AuctionHouseV2Abi } from "../../../../web3/wagmi";
import { getOrCreateAuction } from "../creators/getOrCreateAuction";
import { addAuctionBidEvent } from "../creators/addAuctionBid";
import { handleAuctionSettled } from "../handlers/auctionSettled";
import { handleAuctionExtended } from "../handlers/auctionExtended";
import { handleReservePriceUpdated } from "../handlers/reservePriceUpdated";
import { handleMinBidUpdated } from "../handlers/minBidIncrementUpdated";
import { handleTimeBufferUpdated } from "../handlers/timeBufferUpdated";
import { gnarsAuctionTokenContract } from "../../../../contractValidity/nouns/auctionTokenContract";
import { createTopic0Switcher } from "../../../../topicSwitcher";
import { EventProcessorResult, EventProcessor } from "../../../../events/types";

export const processGnarsAuctionEvent: EventProcessor = async (
  entity: EntityTracker,
  event: OnchainEvent,
): Promise<EventProcessorResult> => {
  const GnarsAuctionHouseEvents = createTopic0Switcher<typeof skateContractV2AuctionHouseV2Abi>(
    skateContractV2AuctionHouseV2Abi,
  );

  const tokenContractAddress =
    ((entity.details as any)?.tokenContract as string) ||
    (await gnarsAuctionTokenContract(
      entity.chainId,
      //tbd maybe we want to pull the actual auction contract from the entity tracker here?
      event.address.toLowerCase() as `0x${string}`,
      entity.id,
    ));

  if (!tokenContractAddress) {
    return;
  }

  const decodeEventArgs = {
    abi: skateContractV2AuctionHouseV2Abi,
    strict: true,
    data: event.data as `0x${string}`,
    topics: event.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
  } as const;

  switch (event.topics[0]) {
    case GnarsAuctionHouseEvents.AuctionCreated: {
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "AuctionCreated" });
      const auction = await getOrCreateAuction(
        {
          tokenId: args.gnarId,
          startTime: args.startTimestamp,
          endTime: args.endTimestamp,
        },
        entity.id,
        event,
        tokenContractAddress,
        "nouns",
      );
      return auction.uniqueId;
    }
    case GnarsAuctionHouseEvents.AuctionBid: {
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "AuctionBid" });
      await addAuctionBidEvent(
        {
          tokenId: args.gnarId,
          sender: args.sender,
          bidder: args.sender,
          value: args.value,
          extended: false,
        },
        event,
        tokenContractAddress,
      );
      break;
    }
    case GnarsAuctionHouseEvents.AuctionSettled: {
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "AuctionSettled" });
      await handleAuctionSettled(
        {
          ...args,
          tokenId: args.gnarId,
          ethPaidToCreators: BigInt(0),
          pointsPaidToCreators: BigInt(0),
        },
        event,
        tokenContractAddress,
      );
      break;
    }
    case GnarsAuctionHouseEvents.AuctionExtended: {
      const { args } = decodeEventLog({ ...decodeEventArgs, eventName: "AuctionExtended" });
      await handleAuctionExtended({ ...args, tokenId: args.gnarId }, event, tokenContractAddress);
      break;
    }
    case GnarsAuctionHouseEvents.AuctionReservePriceUpdated: {
      const { args } = decodeEventLog({
        ...decodeEventArgs,
        eventName: "AuctionReservePriceUpdated",
      });
      await handleReservePriceUpdated({ ...args }, event);
      break;
    }
    case GnarsAuctionHouseEvents.AuctionMinBidIncrementPercentageUpdated: {
      const { args } = decodeEventLog({
        ...decodeEventArgs,
        eventName: "AuctionMinBidIncrementPercentageUpdated",
      });
      await handleMinBidUpdated({ ...args }, event);
      break;
    }
    case GnarsAuctionHouseEvents.AuctionTimeBufferUpdated: {
      const { args } = decodeEventLog({
        ...decodeEventArgs,
        eventName: "AuctionTimeBufferUpdated",
      });
      await handleTimeBufferUpdated({ ...args }, event);
      break;
    }
    case GnarsAuctionHouseEvents.Paused: {
      break;
    }
    case GnarsAuctionHouseEvents.Unpaused: {
      break;
    }
  }
};
