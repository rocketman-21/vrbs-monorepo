"use server";

import { Drafts } from "@cobuild/database/models/social/Drafts";
import { Ideas } from "@cobuild/database/models/social/Ideas";
import { serializeSync } from "@cobuild/database/utils";
import { getUser } from "@cobuild/libs/user/server";
import { isUserThrottled } from "@cobuild/libs/user/usage-limiter";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { revalidatePath } from "next/cache";
import { generateDraftContent } from "./generateDraftContent";

export async function convertIdea(args: { ideaId: string; revolutionId: string }) {
  const { ideaId, revolutionId } = args;
  try {
    const user = await getUser(revolutionId);
    if (!user) throw new Error(`User session not found`);

    if (await isUserThrottled(user, "openai")) {
      throw new Error(`AI usage is limited. Please wait up to 6h & try again`);
    }

    const idea = await Ideas().findById(ideaId);
    if (!idea) throw new Error(`Couldn't convert idea ${ideaId} to draft. Not found`);

    const { title, body } = await generateDraftContent(idea, revolutionId);

    const draft = await Drafts().createForRevolution({
      revolutionId,
      address: idea.creator as `0x${string}`,
      title,
      body,
    });

    if (!draft) throw new Error(`Couldn't create draft.`);

    console.debug(`Draft "${title}" (${draft.draftId}) created from the idea ${ideaId}.`);

    revalidatePath(`/${revolutionId}/dao/drafts`);
    return { draft: serializeSync(draft) };
  } catch (error) {
    console.error(error);
    reportApiError(error, args, "convert-idea");
    return { error: getErrorMessage(error, "Couldn't create draft") };
  }
}
