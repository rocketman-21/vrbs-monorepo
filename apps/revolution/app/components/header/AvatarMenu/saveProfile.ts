"use server";

import { Profiles } from "@cobuild/database/models/social/Profiles";
import { getUser } from "@cobuild/libs/user/server";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { z } from "zod";

const schema = z.object({
  revolutionId: z.string(),
  username: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9_\.]*$/, "Use only letters, numbers, and underscores.")
    .min(3, "Username is too short")
    .max(20, "Username is too long"),
  profilePicture: z.string().trim().optional().default(""),
  bio: z.string().trim().max(120, "Bio is too long").optional().default(""),
  website: z
    .string()
    .trim()
    .url("Make sure your URL starts with https://")
    .or(z.literal(""))
    .default(""),
});

export const saveProfile = async (input: z.infer<typeof schema>) => {
  try {
    const { revolutionId, ...data } = schema.parse(input);

    const user = await getUser(revolutionId);
    if (!user) throw new Error("Authorization error");

    await Profiles().update(user, data);

    return { isSuccess: true, error: undefined };
  } catch (e: any) {
    const error = reportApiError(e, input, "edit-profile");
    console.error("saveProfileError: " + error);
    return { isSuccess: false, error };
  }
};
