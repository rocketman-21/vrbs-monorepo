"use server";

import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { Ideas } from "@cobuild/database/models/social/Ideas";
import { Idea, Serialized } from "@cobuild/database/types";
import { serializeSync } from "@cobuild/database/utils";
import { generateImage } from "@cobuild/libs/openai/image";
import { getUser } from "@cobuild/libs/user/server";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  body: z.string().min(2).max(256),
  creator: z.string().length(42).toLowerCase(),
  revolutionId: z.string().min(1).max(256),
});

interface ActionState {
  error: string | null;
  idea?: Serialized<Idea> | null;
}

export async function createIdea(args: {
  revolutionId: string;
  body: string;
}): Promise<ActionState> {
  const { revolutionId, body } = args;

  const user = await getUser(revolutionId);
  if (!user) throw new Error(`User session not found`);

  const parsed = schema.safeParse({ body, creator: user, revolutionId });

  if (!parsed.success) {
    return { error: getErrorMessage(parsed.error) };
  }

  try {
    const idea = await Ideas().createForRevolution(parsed.data);

    const imageUrl = await generateImage(
      await getImagePromptForIdea(idea.body, revolutionId),
      user,
    );

    if (imageUrl) {
      await Ideas().update({ where: { ideaId: idea.ideaId }, data: { imageUrl } });
    }

    revalidatePath(`/${revolutionId}/dao/ideas`);
    revalidatePath(`/${revolutionId}/dao/ideas/${idea.ideaId}`);
    return { idea: serializeSync(idea), error: null };
  } catch (error) {
    reportApiError(error, parsed.data, "create-idea");
    return { error: getErrorMessage(error) };
  }
}

async function getImagePromptForIdea(idea: string, revolutionId: string) {
  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution) throw new Error(`Revolution not found`);

  const { config, symbol, name } = revolution;

  const description = config.dao?.description || config.defaultSeo.description;

  return `${description}.\n
          The community operates in form of DAO (Decentralized Autonomous Organization).\n
          It has its own treasury and people can submit their proposals how to spend it and then vote on them.\n
          One of the community members has the following idea for the community:\n
          "${idea}"\n
          Generate one square image that would represent this idea. Do not put text on image, just try to visualize the idea.
          The ${name} community uses "${symbol}" (in this exact form - it's a pixel art) as its graphical symbol. If it's possible, please use it in the image in a creative way. DO NOT INCLUDE LONG SENTENCES OR TEXT IN THE IMAGE.         
          `;
}
