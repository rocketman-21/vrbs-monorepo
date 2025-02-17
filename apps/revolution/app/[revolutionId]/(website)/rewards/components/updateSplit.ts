"use server";

import { database } from "@cobuild/database";
import { getUser } from "@cobuild/libs/user/server";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(3, "Name is too short").max(32, "Name is too long"),
});

export const updateSplit = async (
  revolutionId: string,
  split: `0x${string}`,
  input: z.infer<typeof schema>,
) => {
  try {
    const data = schema.parse(input);

    const user = await getUser(revolutionId);
    if (!user) throw new Error("Authorization error");

    const { controller, id } = await database.split.findFirstOrThrow({
      where: { split },
      select: { controller: true, id: true },
    });
    if (user !== controller) throw new Error("Authorization error");

    await database.split.update({ where: { id }, data });

    return { isSuccess: true, error: undefined };
  } catch (e: any) {
    const error = reportApiError(e, input, "edit-split");
    console.error("updateSplitError: " + error);
    return { isSuccess: false, error };
  }
};
