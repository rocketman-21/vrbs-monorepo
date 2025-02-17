"use server";

import { Stories } from "@cobuild/database/models/revolution/stories/Stories";
import { serializeSync } from "@cobuild/database/utils";
import { getUser } from "@cobuild/libs/user/server";
import { isEthAddress } from "@cobuild/libs/utils/account";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { z } from "zod";

const schema = z.object({
  address: z.custom<string>(val => isEthAddress(`${val}`), "Invalid team member's address"),
  comment: z
    .string()
    .trim()
    .min(3, "Comment is too short")
    .max(80, "Comment is too long")
    .optional(),
});

export async function addTeamMember(
  slug: string,
  revolutionId: string,
  isContributor: boolean,
  input: z.infer<typeof schema>,
) {
  try {
    const user = await getUser(revolutionId);
    if (!user) throw new Error(`User session not found`);

    const story = await Stories().findBySlug(slug, revolutionId);
    if (!story) throw new Error(`Story not found`);

    if (!story.canBeEditedBy(user)) throw new Error(`Not authorized`);

    const { team, contributors } = story;
    const { comment = "", address } = schema.parse(input);

    if (!isContributor && team.includes(address as `0x${string}`)) {
      throw new Error("This user is already in the team");
    }

    if (isContributor && contributors.some(c => c.address === address)) {
      throw new Error("This user is already a contributor");
    }

    const updatedStory = await Stories().update(
      slug,
      isContributor
        ? { contributors: [...story.contributors, { address, comment }] }
        : { team: [...story.team, address] },
    );
    if (!updatedStory) throw new Error(`Couldn't add user.`);

    return { story: serializeSync(updatedStory) };
  } catch (error) {
    console.error(error);
    reportApiError(error, input, "add-story-member");
    return { error: getErrorMessage(error, "Couldn't add user") };
  }
}
