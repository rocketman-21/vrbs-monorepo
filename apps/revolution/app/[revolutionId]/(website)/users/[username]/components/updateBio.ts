"use server";

import { database } from "@cobuild/database";
import { getUser } from "@cobuild/libs/user/server";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { revalidateTag } from "next/cache";

export async function updateBio(bio: string, revolutionId: string) {
  try {
    const user = await getUser(revolutionId);
    if (!user) throw new Error(`User session not found`);

    await database.profile.update({ where: { address: user }, data: { bio } });
    revalidateTag("profile");

    return { success: true };
  } catch (error) {
    console.error(error);
    reportApiError(error, bio, "update-bio");
    return { error: getErrorMessage(error, "Couldn't update bio") };
  }
}
