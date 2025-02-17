"use server";

import { Ideas } from "@cobuild/database/models/social/Ideas";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { revalidatePath } from "next/cache";

export async function deleteIdea(args: { ideaId: string; revolutionId: string }) {
  const { ideaId, revolutionId } = args;
  try {
    await Ideas().delete({ where: { ideaId } });
    revalidatePath(`/${revolutionId}/dao/ideas`, "layout");
  } catch (error) {
    reportApiError(error, args, "delete-idea");
  }
}
