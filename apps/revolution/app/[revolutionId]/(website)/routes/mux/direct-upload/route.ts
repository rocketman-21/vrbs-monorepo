import "server-only";

import { getUserFromHeaders } from "@cobuild/libs/user/route";
import Mux from "@mux/mux-node";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { revolutionId: string };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID as string,
  tokenSecret: process.env.MUX_TOKEN_SECRET as string,
});

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const { revolutionId } = params;

    const user = await getUserFromHeaders(request, revolutionId);
    if (!user) {
      return NextResponse.json("Not authorized.", { status: 403 });
    }

    const data = await mux.video.uploads.create({
      cors_origin: "*",
      new_asset_settings: { playback_policy: ["public"], mp4_support: "standard" },
    });

    if (!data.id) {
      throw new Error("Couldn't prepare upload");
    }

    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    console.error({ error: e });
    return NextResponse.json({ success: false, error: e?.message || "Error" }, { status: 500 });
  }
}
