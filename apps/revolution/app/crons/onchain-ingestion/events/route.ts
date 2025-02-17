export const dynamic = "force-dynamic";
export const revalidate = 0;

export const maxDuration = 120;

import "server-only";
import { NextResponse } from "next/server";
import { getAbsoluteUrl } from "@cobuild/libs/utils/url";

import { EventTrackers } from "@cobuild/database/models/eth/EventTrackers";
import { reportIngestionError } from "@cobuild/libs/utils/ingestionError";

export async function GET() {
  try {
    // Fetch all event trackers
    const eventTrackers = await EventTrackers().getAllV2EventTrackers();

    //log number of fetched event trackers
    console.log(`Fetched ${eventTrackers.length} event trackers`);

    // Map each event tracker into a fetch() Promise, then wait for all of them to complete
    await Promise.all(
      eventTrackers.map(eventTracker => {
        const { topic0, chainId, implementationContract, contract } = eventTracker;

        if (!implementationContract) throw new Error("implementationContract is required");
        const url = `/crons/onchain-ingestion/events/by-topic-0?topic0=${topic0}&chainId=${chainId}&implementationContract=${implementationContract}&contract=${contract || ""}`;
        return fetch(getAbsoluteUrl(url), { cache: "no-store" });
      }),
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error({ error });

    reportIngestionError(error, "", "ingest-all-events");
    console.error({ error });
    return new Response(error.message, { status: 500 });
  }
}
