"use server";

import { database } from "@cobuild/database";
import { Grants } from "@cobuild/database/models/revolution/grants/Grants";
import { serializeSync } from "@cobuild/database/utils";
import { getUser } from "@cobuild/libs/user/server";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { getErrorMessage } from "@cobuild/libs/utils/error";

export async function updateGrantImage(input: {
  alloProfileId: string;
  chainId: number;
  imageUrl: string;
}) {
  try {
    const { alloProfileId, chainId, imageUrl } = input;

    const grant = await Grants().getById(alloProfileId, chainId);
    if (!grant) throw new Error("Grant not found");

    const user = await getUser(grant.revolutionId);
    if (!user) throw new Error(`User session not found`);

    const updatedGrant = await database.alloProfile.update({
      where: { chainId_alloProfileId: { alloProfileId, chainId } },
      data: { imageUrl },
    });

    console.debug({ updatedGrant, imageUrl });

    if (!updatedGrant) throw new Error(`Failed to update the grant.`);

    return { grant: serializeSync(updatedGrant) };
  } catch (error) {
    console.error(error);
    reportApiError(error, input, "update-grant");
    return { error: getErrorMessage(error, "Couldn't update grant") };
  }
}
