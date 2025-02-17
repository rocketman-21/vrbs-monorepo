import Fuse from "fuse.js";
import { Prisma } from "prisma-database";
import { cache } from "react";
import slugify from "slugify";
import { database } from "../..";
import { transformDraft } from "./Draft";
import { Revolutions } from "../revolution/revolutions/Revolutions";

export function Drafts() {
  return {
    search,
    findById,
    getLatestId,
    createForRevolution,
    update: async (draftId: string, data: Prisma.DraftUpdateInput) => {
      const draft = await database.draft.update({ where: { draftId }, data });
      return transformDraft(draft);
    },
    countForRevolution,
  };
}

const countForRevolution = async (revolutionId: string) => {
  return await database.draft.count({ where: { revolutionId, isPrivate: false } });
};

const findById = cache(async (draftId: string) => {
  const draft = await database.draft.findFirst({
    where: { draftId },
    include: { profile: { select: { profilePicture: true, username: true } } },
  });
  return draft ? transformDraft(draft) : null;
});

const getLatestId = cache(async (revolutionId: string): Promise<string | null> => {
  const draft = await database.draft.findFirst({
    where: { revolutionId, isPrivate: false },
    select: { draftId: true },
    orderBy: { createdAt: "desc" },
  });
  return draft?.draftId || null;
});

const search = async (options: {
  revolutionId: string;
  phrase?: string;
  sort?: string;
  user?: `0x${string}` | null;
}) => {
  const { revolutionId, phrase, sort = "Newest", user } = options;

  const drafts = (
    await database.draft.findMany({
      where: {
        revolutionId,
        ...(user
          ? {
              OR: [
                { isPrivate: false },
                { isPrivate: true, OR: [{ team: { has: user } }, { address: user }] },
              ],
            }
          : { isPrivate: false }),
      },
      orderBy: getDraftOrderBy(sort),
      include: { profile: { select: { username: true, profilePicture: true } } },
    })
  ).map(transformDraft);

  if (!phrase || phrase.length < 1) return drafts;

  const fuse = new Fuse(drafts, {
    threshold: 0.2,
    keys: [{ name: "title", weight: 3 }, { name: "profile.username", weight: 1.8 }, "body"],
    distance: 10000,
    shouldSort: sort !== "Newest",
  });

  return fuse.search(phrase).map(result => result.item);
};

function getDraftOrderBy(label = "Newest") {
  switch (label) {
    case "Newest":
      return { createdAt: "desc" } as const;
    case "Oldest":
      return { createdAt: "asc" } as const;
    case "Most favored":
      return { createdAt: "desc" } as const; // ToDo
    case "Highest Budget":
      return { createdAt: "desc" } as const; // ToDo
    default:
      return { createdAt: "desc" } as const;
  }
}

async function createForRevolution(args: {
  revolutionId: string;
  address: `0x${string}`;
  title?: string;
  body?: string;
}) {
  const { revolutionId, address, title, body } = args;

  const revolution = await Revolutions().getById(revolutionId);

  if (!revolution) throw new Error("No revolution found");

  const count = 1 + (await database.draft.count({ where: { revolutionId } }));

  const draft = await database.draft.create({
    data: {
      revolutionId,
      address,
      draftId: generateDraftId(revolution?.name || revolutionId, count),
      title: title || `Proposal Draft #${count}`,
      body: body || "",
      isPrivate: true,
    },
  });

  return transformDraft(draft);
}

export const generateDraftId = (entityName: string, count: number) => {
  return slugify(`${entityName}-${count}-${Date.now().toString().slice(-6)}`, {
    lower: true,
    strict: true,
  });
};
