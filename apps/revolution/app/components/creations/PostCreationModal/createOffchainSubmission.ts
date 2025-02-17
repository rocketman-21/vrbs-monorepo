"use server";

import { Submissions } from "@cobuild/database/models/revolution/submissions/Submissions";
import { Serialized } from "@cobuild/database/types";
import { serializeSync } from "@cobuild/database/utils";
import { getUser } from "@cobuild/libs/user/server";
import { isEthAddress } from "@cobuild/libs/utils/account";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { Submission } from "prisma-database";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(100),
  creators: z.array(
    z.object({
      address: z.custom<string>(val => isEthAddress(`${val}`)),
      bps: z.number(),
    }),
  ),
  description: z.string().optional(),
  body: z.string().optional(),
  url: z.string(),
  // video or image
  type: z.enum(["image", "video"]),
});

interface ActionState {
  error: string | null;
  submission?: Serialized<Submission> | null;
}

export async function createOffchainSubmission(args: {
  revolutionId: string;
  chainId: number;
  contractAddress: `0x${string}`;
  data: z.infer<typeof schema>;
}): Promise<ActionState> {
  try {
    const { revolutionId, chainId, contractAddress, data } = args;

    const user = await getUser(revolutionId);
    if (!user) throw new Error(`User session not found`);

    const parsed = schema.safeParse({ ...data });

    if (!parsed.success) {
      console.error({ error: parsed.error, data });
      throw new Error(getErrorMessage(parsed.error));
    }

    const { name, creators, description, body, url, type } = parsed.data;

    const submission = await Submissions().createCreation(
      {
        name,
        creators: creators.map(creator => ({
          address: creator.address,
          bps: creator.bps,
        })),
        description,
        body,
        chainId,
        url,
        contractAddress,
        pieceId: null,
        mediaMetadata: {
          type,
          width: null,
          height: null,
          thumbnailIpfs: url,
        },
        isOnchain: false,
        createdAt: new Date(),
      },
      user,
    );

    return { submission: serializeSync(submission), error: null };
  } catch (error) {
    console.error(error);
    reportApiError(error, args.data, "create-submission");
    return { error: getErrorMessage(error) };
  }
}
