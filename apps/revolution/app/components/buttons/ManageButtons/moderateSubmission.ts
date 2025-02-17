"use server";

import { database } from "@cobuild/database";
import { isAdmin } from "@cobuild/libs/revolution/admin";
import { getUser } from "@cobuild/libs/user/server";
import { reportApiError } from "@cobuild/libs/utils/apiError";

export async function moderateSubmission(
  action: "hide" | "show",
  slug: string,
  revolutionId: string,
) {
  try {
    const user = await getUser(revolutionId);
    if (!user) throw new Error("Please login");

    const submission = await database.submission.findFirst({ where: { slug } });
    if (!submission) throw new Error("Submission not found");

    const isCreator = submission.creators.some(c => c.address === user);
    if (!isAdmin(user, revolutionId) && !isCreator) throw new Error("Unauthorized");

    await database.submission.update({
      where: { slug },
      data: { isHidden: action === "hide" ? true : false },
    });

    return { isSuccess: true, error: undefined };
  } catch (e: any) {
    const error = reportApiError(e, slug, "moderate-submission");
    console.error("moderateSubmission: " + error);
    return { isSuccess: false, error };
  }
}
