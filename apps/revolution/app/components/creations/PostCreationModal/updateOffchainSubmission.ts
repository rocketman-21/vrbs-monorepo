"use server";

import { database } from "@cobuild/database";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
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
  url: z.string(),
  offchainSlug: z.string(),
  onchainSlug: z.string(),
  onchainPieceId: z.string(),
});

interface ActionState {
  error: string | null;
  submission?: Serialized<Submission> | null;
}

export async function updateOffchainSubmission(args: {
  revolutionId: string;
  data: z.infer<typeof schema>;
}): Promise<ActionState> {
  try {
    const { revolutionId, data } = args;

    const user = await getUser(revolutionId);
    if (!user) throw new Error(`User session not found`);

    const revolution = await Revolutions().getById(revolutionId);

    if (!revolution) throw new Error(`Revolution not found`);
    if (!revolution.addresses?.cultureIndex) throw new Error(`Culture Index not found`);

    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      console.error({ error: parsed.error, data });
      throw new Error(getErrorMessage(parsed.error));
    }

    const offchainSubmission = await Submissions().findBySlug(data.offchainSlug);

    if (!offchainSubmission) {
      throw new Error(`Offchain submission not found`);
    }

    console.debug({ offchainSubmission, revolutionId, data: parsed.data });

    // check all fields against supplied data

    if (offchainSubmission.name !== parsed.data.name) {
      throw new Error(`Name is not valid`);
    }
    //loop over creators and check if they are valid
    for (let i = 0; i < parsed.data.creators.length; i++) {
      if (offchainSubmission.creators[i].address !== parsed.data.creators[i].address) {
        throw new Error(`Offchain submission creator address is not valid`);
      }
      if (offchainSubmission.creators[i].bps !== parsed.data.creators[i].bps) {
        throw new Error(`Creator bps is not valid`);
      }
    }
    if (
      offchainSubmission.description &&
      offchainSubmission.description !== parsed.data.description
    ) {
      throw new Error(`Description is not valid`);
    }
    if (offchainSubmission.url !== parsed.data.url) {
      throw new Error(`Offchain submission URL is not valid`);
    }

    const onchainSubmission = await Submissions().findBySlug(data.onchainSlug);

    if (!onchainSubmission) {
      throw new Error(`Onchain submission not found`);
    }

    console.debug({ onchainSubmission });

    if (onchainSubmission.pieceId !== data.onchainPieceId) {
      throw new Error(`Onchain submission piece ID does not match the provided piece ID`);
    }
    if (onchainSubmission.name !== parsed.data.name) {
      throw new Error(`Onchain submission name does not match the provided name`);
    }
    if (
      onchainSubmission.description &&
      onchainSubmission.description !== parsed.data.description
    ) {
      throw new Error(`Onchain submission description does not match the provided description`);
    }
    if (onchainSubmission.url !== parsed.data.url) {
      throw new Error(`Onchain submission URL does not match the provided URL`);
    }
    // check creators
    for (let i = 0; i < parsed.data.creators.length; i++) {
      if (
        onchainSubmission.creators[i].address.toLowerCase() !==
        parsed.data.creators[i].address.toLowerCase()
      ) {
        throw new Error(
          `Onchain submission creator address does not match the provided creator address`,
        );
      }
      if (onchainSubmission.creators[i].bps !== parsed.data.creators[i].bps) {
        throw new Error(`Onchain submission creator bps does not match the provided creator bps`);
      }
    }

    console.debug(
      `Updating offchain submission ${data.offchainSlug} to onchain submission ${data.onchainSlug}`,
    );

    //update submission onchainSlug to submission.slug
    const updatedSubmission = await database.submission.update({
      where: { slug: data.offchainSlug },
      data: {
        onchainSlug: data.onchainSlug,
      },
    });

    return { submission: serializeSync(updatedSubmission), error: null };
  } catch (error) {
    console.error(error);
    reportApiError(error, args.data, "update-offchain-submission");
    return { error: getErrorMessage(error) };
  }
}
