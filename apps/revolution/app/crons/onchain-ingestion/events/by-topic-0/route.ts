export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 120;

import "server-only";

import { NextResponse } from "next/server";
import { ingestEventTracker } from "onchain-ingestion/events/eventIngestion";
import { NextRequest } from "next/server";
import { reportIngestionError } from "@cobuild/libs/utils/ingestionError";

export async function GET(req: NextRequest) {
  try {
    const searchParams = new URL(req.url).searchParams;

    const topic0 = searchParams.get("topic0")?.toString();
    const implementationContract = searchParams
      .get("implementationContract")
      ?.toString()
      ?.toLowerCase();
    const contract = searchParams.get("contract")?.toString()?.toLowerCase();
    const chainId = searchParams.get("chainId")?.toString();

    if (!chainId) throw new Error("chainId is required");
    if (!implementationContract) throw new Error("implementationContract is required");
    if (!topic0) throw new Error("topic0 is required");

    await ingestEventTracker(
      topic0,
      parseInt(chainId),
      implementationContract,
      !!contract ? (contract as `0x${string}`) : undefined,
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    const searchParams = new URL(req.url).searchParams;

    const topic0 = searchParams.get("topic0")?.toString();
    const implementationContract = searchParams
      .get("implementationContract")
      ?.toString()
      ?.toLowerCase();
    const chainId = searchParams.get("chainId")?.toString();
    const contract = searchParams.get("contract")?.toString()?.toLowerCase();

    reportIngestionError(
      error,
      JSON.stringify({ chainId, implementationContract, topic0, contract }),
      "ingest-event-topic0",
    );
    console.error({ error });
    return new Response(error.message, { status: 500 });
  }
}
