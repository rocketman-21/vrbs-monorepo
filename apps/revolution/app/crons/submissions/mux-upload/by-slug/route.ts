export const dynamic = "force-dynamic";

import "server-only";

import { NextRequest } from "next/server";
import { uploadSubmissionToMux } from "../utils";
import { Submissions } from "@cobuild/database/models/revolution/submissions/Submissions";
import { reportApiError } from "@cobuild/libs/utils/apiError";

export async function GET(req: NextRequest) {
  try {
    const searchParams = new URL(req.url).searchParams;

    const slug = searchParams.get("slug");
    const submission = await Submissions().findBySlug(slug as string);

    if (!submission) throw new Error("Submission not found");

    await uploadSubmissionToMux(submission);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e: any) {
    console.error({ error: e });
    reportApiError(e, {}, "mux-upload-single-submission");

    // return res.status(422).end(e.message);
    return new Response(e.message, {
      status: 500,
    });
  }
}
