export const dynamic = "force-dynamic";

import "server-only";

import { database } from "@cobuild/database";

import { NextRequest } from "next/server";
import { getAbsoluteUrl } from "@cobuild/libs/utils/url";
import { reportApiError } from "@cobuild/libs/utils/apiError";

export async function GET(req: NextRequest) {
  try {
    const submissions = await database.submission.findMany({
      where: { OR: [{ muxStreamUrl: null }, { muxStreamUrl: { isSet: false } }] },
      orderBy: { createdAt: "desc" },
    });

    await Promise.all(
      submissions.map(submission => {
        if (
          submission.muxStreamUrl ||
          !submission.url ||
          submission?.mediaMetadata?.type === "image"
        )
          return;
        console.log("running for", submission.slug);
        fetch(getAbsoluteUrl(`/crons/submissions/mux-upload/by-slug?slug=${submission.slug}`), {
          cache: "no-store",
        });
      }),
    );

    // return res.status(200).json({ success: true });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e: any) {
    console.error({ error: e });
    reportApiError(e, {}, "mux-upload-submissions");
    // return res.status(422).end(e.message);
    return new Response(e.message, {
      status: 500,
    });
  }
}
