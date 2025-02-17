export const dynamic = "force-dynamic";
export const revalidate = 0;

export const maxDuration = 120;

import "server-only";
import { NextResponse } from "next/server";
import { getAbsoluteUrl } from "@cobuild/libs/utils/url";

import { EventTrackers } from "@cobuild/database/models/eth/EventTrackers";
import { getRevolutionBuilderImplementations } from "@cobuild/libs/web3/viem/utils/revolutionBuilder";
import { REVOLUTION_BUILDER_ADDRESSES } from "@cobuild/database/models/revolution/revolutions/addresses";
import { zeroAddress } from "viem";
import { reportIngestionError } from "@cobuild/libs/utils/ingestionError";

export async function GET() {
  try {
    // Fetch all event trackers
    const eventTrackers = await EventTrackers().getAllV2EventTrackers();

    const chainIds = new Set(eventTrackers.map(eventTracker => eventTracker.chainId));

    const implementationContractAddresses: `0x${string}`[] = [];

    //filter for implementationContract is a revolution implementation contract
    for (const chainId of chainIds) {
      const builderAddress = REVOLUTION_BUILDER_ADDRESSES[chainId];
      if (!builderAddress) continue;

      const implementations = await getRevolutionBuilderImplementations(builderAddress, chainId);

      for (const [key, address] of Object.entries(implementations)) {
        if (address === zeroAddress) {
          throw new Error(
            `Implementation address for ${key} is the zero address, builder: ${builderAddress} chainId: ${chainId}`,
          );
        }
        implementationContractAddresses.push(address);
      }
    }

    //log number of fetched event trackers
    console.log(`Fetched ${eventTrackers.length} revolution event trackers`);

    // Map each event tracker into a fetch() Promise, then wait for all of them to complete
    await Promise.all(
      eventTrackers.map(eventTracker => {
        const { topic0, chainId, implementationContract, contract } = eventTracker;

        if (!implementationContract) throw new Error("implementationContract is required");

        // make sure they are revolution event trackers
        if (!implementationContractAddresses.includes(implementationContract as `0x${string}`))
          return;

        const url = getAbsoluteUrl(
          `/crons/onchain-ingestion/events/by-topic-0?topic0=${topic0}&chainId=${chainId}&implementationContract=${implementationContract}&contract=${contract || ""}`,
        );
        console.log({ url });
        return fetch(url, { cache: "no-store" });
      }),
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error({ error });

    reportIngestionError(error, "", "ingest-revolution-events");
    console.error({ error });
    return new Response(error.message, { status: 500 });
  }
}
