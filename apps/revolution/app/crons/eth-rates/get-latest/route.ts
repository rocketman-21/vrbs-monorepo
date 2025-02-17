export const dynamic = "force-dynamic";
export const revalidate = 3600;
import { getLatestEthRates } from "@cobuild/database/models/eth/MarketDataRedis";

import "server-only";

import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
    const rates = await getLatestEthRates();

    return NextResponse.json(rates);
  } catch (error: any) {
    console.error({ error });
    return new Response(error.message, { status: 500 });
  }
}
