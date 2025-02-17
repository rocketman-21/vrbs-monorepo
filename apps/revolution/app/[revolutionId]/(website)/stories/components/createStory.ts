"use server";

import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { Stories } from "@cobuild/database/models/revolution/stories/Stories";
import { serializeSync } from "@cobuild/database/utils";
import { getUser } from "@cobuild/libs/user/server";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(3, "Title is too short").max(48, "Title is too long"),
  thumbnailUrl: z.string().trim().url("Please upload thumbnail"),
  description: z
    .string()
    .trim()
    .min(3, "Description is too short")
    .max(2000, "Description is too long"),
  externalUrl: z.string().url("Please add a valid URL").or(z.literal("")),
  alloProfileId: z.string().trim().nullable(),
});

export async function createStory(input: z.infer<typeof schema>, revolutionId: string) {
  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution) throw new Error(`Revolution not found`);

  try {
    const user = await getUser(revolutionId);
    if (!user) throw new Error(`User session not found`);

    const data = schema.parse(input);
    const story = await Stories().create({
      ...data,
      revolutionId,
      isPublished: true,
      team: [user],
    });

    if (!story) throw new Error(`Couldn't create story.`);

    return { story: serializeSync(story) };
  } catch (error) {
    console.error(error);
    reportApiError(error, input, "create-story");
    return { error: getErrorMessage(error, "Couldn't create story") };
  }
}
