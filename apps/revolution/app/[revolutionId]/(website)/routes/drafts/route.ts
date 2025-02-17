import "server-only";

import { Drafts } from "@cobuild/database/models/social/Drafts";
import { IDraft } from "@cobuild/database/types";
import { serializeSync } from "@cobuild/database/utils";
import { getUserFromHeaders } from "@cobuild/libs/user/route";
import pick from "lodash/pick";
import { NextRequest, NextResponse } from "next/server";

const returnFields: Array<keyof IDraft> = [
  "profile",
  "title",
  "address",
  "draftId",
  "updatedAt",
  "isOnChain",
];

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { revolutionId?: string };
  },
) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const revolutionId = params.revolutionId?.toString();
    const phrase = searchParams.get("phrase")?.trim();
    const sort = searchParams.get("sort")?.trim();

    if (!revolutionId) throw new Error("Invalid revolutionId");

    const user = await getUserFromHeaders(request, revolutionId);

    const drafts = await Drafts().search({ revolutionId, phrase, sort, user });

    return NextResponse.json(serializeSync(drafts.map(p => pick(p, returnFields))));
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: { revolutionId?: string };
  },
) {
  try {
    const revolutionId = params.revolutionId?.toString();
    const user = await getUserFromHeaders(request, revolutionId);

    if (!user) {
      return new Response("Not authorized.", { status: 403 });
    }

    if (!revolutionId) {
      throw new Error("Invalid revolutionId");
    }

    const draft = await Drafts().createForRevolution({
      revolutionId,
      address: user,
    });

    return NextResponse.json(serializeSync(draft));
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ success: false, error: e?.message || "Error" }, { status: 500 });
  }
}
