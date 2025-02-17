import "server-only";

import { Posts } from "@cobuild/database/models/social/Posts";
import { getUserFromHeaders } from "@cobuild/libs/user/route";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { revolutionId: string | undefined } },
) {
  const revolutionId = params?.revolutionId?.toString();
  const body = await req.json();

  const user = await getUserFromHeaders(req, revolutionId);
  if (!user) {
    return new Response("Please login.", { status: 401 });
  }

  const { content, parentPostId, rootPostId, scope } = body;

  if (!content || !scope?.type || !scope?.id) {
    return new Response("Invalid post data", { status: 500 });
  }

  try {
    const post = await Posts().add(
      {
        address: user,
        markdown: content,
        scope,
        parentPostId,
        rootPostId,
      },
      revolutionId ? { type: "revolution", id: revolutionId } : scope,
    );
    return new Response(JSON.stringify({ post }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error({ error: e });
    return new Response(e.message, {
      status: 500,
    });
  }
}
