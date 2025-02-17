"use server";

import { Grants } from "@cobuild/database/models/revolution/grants/Grants";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { serializeSync } from "@cobuild/database/utils";
import { getUser } from "@cobuild/libs/user/server";
import { isEthAddress } from "@cobuild/libs/utils/account";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(5, "Title is too short").max(480, "Title is too long"),
  chainId: z.number(),
  imageUrl: z.string().trim().url("Please upload an icon"),
  alloProfileId: z.string().trim(),
  parentGrantsContract: z.custom<string>(
    val => isEthAddress(`${val}`),
    "Invalid parent grants contract address",
  ),
  team: z.array(z.custom<string>(val => isEthAddress(`${val}`), "Invalid team member's address")),
  body: z.string().trim().min(5, "Description is too short").max(5000, "Description is too long"),
  isApplicable: z.boolean(),
  isApplication: z.boolean(),
  maxOpenings: z.number().optional(),
  openings: z.number().optional(),
});

export async function createSubgrant(input: z.infer<typeof schema>, revolutionId: string) {
  const rev = await Revolutions().getById(revolutionId);
  if (!rev) throw new Error(`Revolution not found`);

  try {
    const user = await getUser(revolutionId);
    if (!user) throw new Error(`User session not found`);

    const data = schema.parse(input);

    const grant = await Grants().create({
      ...data,
      revolutionId,
      parentGrantsContract: data.parentGrantsContract.toLowerCase(),
    });
    if (!grant) throw new Error(`Couldn't create grant.`);

    revalidatePath(`/${revolutionId}/grants`);
    return { grant: serializeSync(grant) };
  } catch (error) {
    console.debug({ error });
    console.error(error);
    reportApiError(error, input, "create-subgrant");
    return { error: getErrorMessage(error, "Couldn't create grant") };
  }
}
