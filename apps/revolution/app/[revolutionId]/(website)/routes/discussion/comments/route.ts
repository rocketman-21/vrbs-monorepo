import "server-only";

import { Posts } from "@cobuild/database/models/social/Posts";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const type = searchParams.get("type");

  if (!type || !id || !Posts().isValidScopeType(type)) {
    return new Response("Invalid input data", {
      status: 500,
    });
  }

  try {
    const comments = await Posts().getForScope(id);

    return new Response(JSON.stringify(comments), {
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
