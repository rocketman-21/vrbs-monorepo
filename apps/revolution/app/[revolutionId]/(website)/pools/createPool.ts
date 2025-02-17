"use server";

import { Pools } from "@cobuild/database/models/revolution/pools/Pools";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { serializeSync } from "@cobuild/database/utils";
import { getUser } from "@cobuild/libs/user/server";
import { isEthAddress } from "@cobuild/libs/utils/account";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(3, "Title is too short").max(48, "Title is too long"),
  imageUrl: z.string().trim().url("Please upload an icon"),
  strategy: z.custom<string>(val => isEthAddress(`${val}`), "Invalid strategy's address"),
  chainId: z.number(),
  alloPoolId: z.string().trim(),
  tags: z
    .array(z.string())
    .min(1, "Please add at least one tag")
    .max(3, "Please add no more than 3 tags"),
  managers: z.array(
    z.custom<string>(val => isEthAddress(`${val}`), "Invalid team member's address"),
  ),
  body: z.string().trim().min(3, "Description is too short").max(2000, "Description is too long"),
});

export async function savePoolToDb(input: z.infer<typeof schema>, revolutionId: string) {
  const rev = await Revolutions().getById(revolutionId);

  if (!rev) throw new Error(`Revolution not found`);

  try {
    const user = await getUser(revolutionId);
    if (!user) throw new Error(`User session not found`);

    const data = schema.parse(input);
    const pool = await Pools().create({
      ...data,
      revolutionId,
      strategy: data.strategy.toLowerCase(),
    });
    if (!pool) throw new Error(`Couldn't create pool.`);

    revalidatePath(`/${revolutionId}/pools`);
    return { pool: serializeSync(pool) };
  } catch (error) {
    console.error(error);
    reportApiError(error, input, "create-pool");
    return { error: getErrorMessage(error, "Couldn't create pool") };
  }
}
