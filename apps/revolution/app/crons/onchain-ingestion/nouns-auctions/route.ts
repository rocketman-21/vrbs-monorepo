export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 300;

import "server-only";

import { NextResponse } from "next/server";
import { ingestEntityByType } from "onchain-ingestion/entityIngestion/ingestEntityByType";
import { NextRequest } from "next/server";
import { reportIngestionError } from "@cobuild/libs/utils/ingestionError";

export async function GET(req: NextRequest) {
  try {
    await ingestEntityByType("nouns_auction");
    await ingestEntityByType("gnars_auction");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error({ error });
    reportIngestionError(error, "", "ingest-nouns-auction-house");
    console.error({ error });
    return new Response(error.message, { status: 500 });
  }
}
