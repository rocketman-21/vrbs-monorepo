"use server";

import { Stories } from "@cobuild/database/models/revolution/stories/Stories";
import { serializeSync } from "@cobuild/database/utils";
import { getUser } from "@cobuild/libs/user/server";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { getErrorMessage } from "@cobuild/libs/utils/error";

export async function addImpact(input: {
  imageUrl: string;
  thumbnailUrl: string;
  revolutionId: string;
}) {
  try {
    const { imageUrl, thumbnailUrl, revolutionId } = input;

    const user = await getUser(revolutionId);
    if (!user) throw new Error(`User session not found`);

    const story = await Stories().create({
      title: "",
      isFile: true,
      imageUrl,
      thumbnailUrl,
      revolutionId,
      isPublished: true,
      team: [user],
    });

    if (!story) throw new Error();

    return { item: serializeSync(story) };
  } catch (error) {
    console.error(error);
    reportApiError(error, input, "add-portfolio-item");
    return { error: getErrorMessage(error, "Failed to add item") };
  }
}
