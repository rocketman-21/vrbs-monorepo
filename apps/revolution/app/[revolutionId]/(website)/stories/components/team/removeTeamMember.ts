"use server";

import { Stories } from "@cobuild/database/models/revolution/stories/Stories";
import { serializeSync } from "@cobuild/database/utils";
import { getUser } from "@cobuild/libs/user/server";
import { isEthAddress } from "@cobuild/libs/utils/account";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { getErrorMessage } from "@cobuild/libs/utils/error";

export async function removeTeamMember(
  slug: string,
  revolutionId: string,
  address: string,
  isContributor: boolean,
) {
  try {
    const user = await getUser(revolutionId);
    if (!user) throw new Error(`User session not found`);

    if (!isEthAddress(address)) throw new Error("Invalid address");

    const story = await Stories().findBySlug(slug, revolutionId);
    if (!story) throw new Error(`Story not found`);

    if (!story.canBeEditedBy(user)) throw new Error(`Not authorized`);

    if (!isContributor && story.team.length === 1) throw new Error(`Can't remove the last member`);

    const updatedStory = await Stories().update(
      slug,
      isContributor
        ? { contributors: story.contributors.filter(c => c.address !== address) }
        : { team: story.team.filter(t => t !== address) },
    );
    if (!updatedStory) throw new Error(`Couldn't remove user.`);

    return { story: serializeSync(updatedStory) };
  } catch (error) {
    console.error(error);
    reportApiError(error, address, "remove-story-member");
    return { error: getErrorMessage(error, "Couldn't remove user") };
  }
}
