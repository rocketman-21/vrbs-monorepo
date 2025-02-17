import "server-only";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 300;

import { NextResponse } from "next/server";
import { ingestEntityByType } from "onchain-ingestion/entityIngestion/ingestEntityByType";
import { NextRequest } from "next/server";
import { reportIngestionError } from "@cobuild/libs/utils/ingestionError";

export async function GET(req: NextRequest) {
  try {
    // ingest all entities
    await ingestEntityByType("culture_index");
    await ingestEntityByType("revolution_auction");
    await ingestEntityByType("points_emitter");
    await ingestEntityByType("revolution_split");
    await ingestEntityByType("revolution_builder");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error({ error });
    reportIngestionError(error, "", "ingest-revolution-contracts");
    console.error({ error });
    return new Response(error.message, { status: 500 });
  }
}
