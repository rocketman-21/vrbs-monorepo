"use server";

import { Stories } from "@cobuild/database/models/revolution/stories/Stories";
import { serializeSync } from "@cobuild/database/utils";
import { getUser } from "@cobuild/libs/user/server";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(3, "Title is too short").max(48, "Title is too long"),
  description: z
    .string()
    .trim()
    .min(3, "Description is too short")
    .max(2000, "Description is too long"),
  externalUrl: z.string().url("Please add a valid URL").or(z.literal("")).optional(),
  alloProfileId: z.string().trim().nullable(),
});

export async function updateStory(
  slug: string,
  revolutionId: string,
  input: z.infer<typeof schema>,
) {
  try {
    const user = await getUser(revolutionId);
    if (!user) throw new Error(`User session not found`);

    const story = await Stories().findBySlug(slug, revolutionId);
    if (!story) throw new Error(`Story not found`);

    if (!story.canBeEditedBy(user)) throw new Error(`Not authorized`);

    const data = schema.parse(input);
    const isFile = !story.isFile && data.description?.length === 0;
    const updatedStory = await Stories().update(slug, { ...data, isFile });

    if (!updatedStory) throw new Error(`Couldn't update story.`);

    return { story: serializeSync(updatedStory) };
  } catch (error) {
    console.error(error);
    reportApiError(error, input, "update-story");
    return { error: getErrorMessage(error, "Couldn't update story") };
  }
}
