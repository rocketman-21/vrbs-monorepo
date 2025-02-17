"use server";

import { database } from "@cobuild/database";
import { Grants } from "@cobuild/database/models/revolution/grants/Grants";
import { serializeSync } from "@cobuild/database/utils";
import { getUser } from "@cobuild/libs/user/server";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { revalidateTag } from "next/cache";

export async function approveGrantApplication(alloProfileId: string, chainId: number) {
  try {
    const application = await Grants().getById(alloProfileId, chainId);
    if (!application) throw new Error(`Application not found`);

    const grant = await application.parent();
    if (!grant) throw new Error(`Grant not found`);

    const user = await getUser(application.revolutionId);
    const canManage = grant.canBeManagedBy(user);
    if (!canManage) throw new Error(`Not authorized`);

    if (!grant.isApplicable || !grant.maxOpenings || !grant.openings) {
      throw new Error(`Grant is not applicable`);
    }

    const updatedGrant = await database.alloProfile.update({
      where: { chainId_alloProfileId: { alloProfileId: grant.alloProfileId, chainId } },
      data: { openings: grant.openings - 1 },
    });

    if (!updatedGrant) throw new Error(`Failed to update the grant.`);

    revalidateTag("grant");

    return { grant: serializeSync(updatedGrant) };
  } catch (error) {
    console.error(error);
    reportApiError(error, { alloProfileId, chainId }, "approve-grant-application");
    return { error: getErrorMessage(error, "Couldn't approve grant application") };
  }
}
