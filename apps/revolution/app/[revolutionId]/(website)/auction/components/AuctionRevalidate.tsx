"use client";

import { auctionHouseAbi } from "@cobuild/revolution";
import { useRevalidateOnFocus } from "@cobuild/ui/organisms/RevalidateOnFocus/useRevalidateOnFocus";
import { useRevolution } from "app/libs/useRevolution";
import { useRouter } from "next/navigation";
import { storeEventLogs } from "onchain-ingestion/functions/storeEventLogs";
import { useCallback } from "react";
import { Log } from "viem";
import { useWatchContractEvent } from "wagmi";
import { revalidateAuction } from "./revalidateAuction";

interface Props {
  address: `0x${string}`;
  chainId: number;
  hasBeenLaunched: boolean;
  isOver: boolean;
}

const abi = auctionHouseAbi;

export const AuctionRevalidate = (props: Props) => {
  const { address, chainId, hasBeenLaunched, isOver } = props;
  const router = useRouter();
  const { revolutionId } = useRevolution();

  const onLogs = useCallback(
    async (logs: Log[]) => {
      console.debug("New auction event", logs);
      await storeEventLogs(logs, chainId, {
        trackerType: "revolution_auction",
        chainId,
        contract: address,
      });

      await revalidateAuction(revolutionId);
      router.refresh();
    },
    [address, chainId, revolutionId, router],
  );

  useWatchContractEvent({
    address,
    chainId,
    abi,
    eventName: !isOver ? "AuctionBid" : undefined,
    onLogs,
  });
  useWatchContractEvent({
    address,
    chainId,
    abi,
    eventName: !isOver ? "AuctionExtended" : undefined,
    onLogs,
  });

  useWatchContractEvent({
    address,
    chainId,
    abi,
    eventName: !hasBeenLaunched || isOver ? "AuctionSettled" : undefined,
    onLogs,
  });

  useWatchContractEvent({
    address,
    chainId,
    abi,
    eventName: !hasBeenLaunched || isOver ? "AuctionCreated" : undefined,
    onLogs,
  });

  useRevalidateOnFocus();

  return null;
};
