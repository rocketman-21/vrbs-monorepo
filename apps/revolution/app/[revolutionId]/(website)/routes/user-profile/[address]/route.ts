import "server-only";

export const revalidate = 3600; // 1 hour

import { Profiles } from "@cobuild/database/models/social/Profiles";
import { isEthAddress } from "@cobuild/libs/utils/account";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { revolutionId: string; address: `0x${string}` };
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const address = params.address?.toString();

    if (!address || !isEthAddress(address)) {
      throw new Error("Invalid revolutionId or address");
    }

    const profile = await Profiles().get(address as `0x${string}`);

    return NextResponse.json(profile, {
      headers: {
        "Cache-Control": "public, max-age=7200",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Error" }, { status: 500 });
  }
}
