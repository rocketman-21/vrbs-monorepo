export const dynamic = "force-dynamic";
export const revalidate = 3600;
import { fetchAndSetEthRates } from "@cobuild/database/models/eth/MarketDataRedis";

import "server-only";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    await fetchAndSetEthRates();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error({ error });
    return new Response(error.message, { status: 500 });
  }
}
