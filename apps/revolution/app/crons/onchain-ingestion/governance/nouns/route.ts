export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 300;

import "server-only";

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { ingestEntityByType } from "onchain-ingestion/entityIngestion/ingestEntityByType";
import { reportIngestionError } from "@cobuild/libs/utils/ingestionError";

export async function GET(req: NextRequest) {
  try {
    // await ingestEntityByType("nouns_dao_v1");
    // await ingestEntityByType("nouns_dao_v2");
    await ingestEntityByType("nouns_dao_v3");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error({ error });
    reportIngestionError(error, "", "ingest-nouns-governance");
    return new Response(error.message, { status: 500 });
  }
}
