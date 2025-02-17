"use server";

import { database } from "@cobuild/database";
import { Stories } from "@cobuild/database/models/revolution/stories/Stories";
import { serializeSync } from "@cobuild/database/utils";
import { deleteCacheResult } from "@cobuild/libs/cache";
import { getUser } from "@cobuild/libs/user/server";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { z } from "zod";

const schema = z.object({
  url: z
    .string()
    .url("Please add a valid URL")
    .regex(/warpcast\.com/, "URL must be from warpcast.com"),
});

export async function attachCast(
  input: z.infer<typeof schema>,
  slug: string,
  revolutionId: string,
) {
  const story = await Stories().findBySlug(slug, revolutionId);
  if (!story) throw new Error(`Story not found`);

  try {
    const user = await getUser(revolutionId);
    if (!user) throw new Error(`User session not found`);

    const { url } = schema.parse(input);

    if (story.casts.includes(url)) throw new Error(`Cast already attached to the story.`);

    const updatedStory = await database.story.update({
      where: { slug: slug, revolutionId: revolutionId },
      data: { casts: { push: url } },
    });

    if (!updatedStory) throw new Error(`Failed to attach cast to the story.`);

    await deleteCacheResult(`story_updates_${slug}`);

    return { story: serializeSync(updatedStory) };
  } catch (error) {
    console.error(error);
    reportApiError(error, input, "create-story");
    return { error: getErrorMessage(error, "Couldn't create story") };
  }
}
