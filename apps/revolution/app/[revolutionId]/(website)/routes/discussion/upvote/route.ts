import "server-only";

import { Posts } from "@cobuild/database/models/social/Posts";
import { getUserFromHeaders } from "@cobuild/libs/user/route";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { revolutionId: string } }) {
  const body = await req.json();

  const revolutionId = params.revolutionId.toString();
  const user = await getUserFromHeaders(req, revolutionId);

  const postId = body.postId;

  if (!postId) {
    return new Response("Invalid post data", {
      status: 500,
    });
  }

  if (!user) {
    return new Response("Not authorized.", {
      status: 401,
    });
  }

  try {
    const post = await Posts().toggleVote(postId, user, revolutionId);

    if (!post) {
      return new Response("Invalid post", {
        status: 500,
      });
    }

    const { upvotes } = post;

    return new Response(JSON.stringify({ upvotes }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e: any) {
    console.error({ error: e });
    return new Response(e.message, {
      status: 500,
    });
  }
}
