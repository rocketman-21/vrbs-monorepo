"use server";

import { Grants } from "@cobuild/database/models/revolution/grants/Grants";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { VRBS_GRANTS_PROXY } from "@cobuild/database/models/revolution/revolutions/addresses";
import { serializeSync } from "@cobuild/database/utils";
import { getUser } from "@cobuild/libs/user/server";
import { isEthAddress } from "@cobuild/libs/utils/account";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(3, "Title is too short").max(480, "Title is too long"),
  tagline: z.string().trim().min(3, "Tagline is too short").max(48, "Tagline is too long"),
  imageUrl: z.string().trim().url("Please upload an icon"),
  chainId: z.number(),
  alloProfileId: z.string().trim(),
  tags: z
    .array(z.string())
    .min(1, "Please add at least one tag")
    .max(3, "Please add no more than 3 tags"),
  team: z.array(z.custom<string>(val => isEthAddress(`${val}`), "Invalid team member's address")),
  body: z.string().trim().min(3, "Description is too short").max(5000, "Description is too long"),
});

export async function createGrant(input: z.infer<typeof schema>, revolutionId: string) {
  const rev = await Revolutions().getById(revolutionId);

  if (!rev) throw new Error(`Revolution not found`);

  try {
    const user = await getUser(revolutionId);
    if (!user) throw new Error(`User session not found`);

    const data = schema.parse(input);
    const grant = await Grants().create({
      ...data,
      revolutionId,
      parentGrantsContract: VRBS_GRANTS_PROXY,
    });
    if (!grant) throw new Error(`Couldn't create grant.`);

    revalidatePath(`/${revolutionId}/grants`);
    return { grant: serializeSync(grant) };
  } catch (error) {
    console.error(error);
    reportApiError(error, input, "create-grant");
    return { error: getErrorMessage(error, "Couldn't create grant") };
  }
}
