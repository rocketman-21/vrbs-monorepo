import "server-only";

import { subDays } from "date-fns";
import { revalidateTag, unstable_cache } from "next/cache";
import { Prisma } from "prisma-database";
import { cache } from "react";
import slugify from "slugify";
import { database } from "../../..";
import { transformStory } from "./Story";

export function Stories() {
  return {
    findBySlug,
    create,
    update,
    getForRevolution,
    getForUser,
    countForUser,
    getForGrant,
    getForLeaderboard,
  };
}

const findBySlug = cache(async (slug: string, revolutionId: string) => {
  const story = await database.story.findFirst({
    where: { slug, revolutionId },
  });

  return story ? transformStory(story) : null;
});

const getForRevolution = unstable_cache(
  async (revolutionId: string, take = 12, onlyActive?: boolean) => {
    const stories = await database.story.findMany({
      where: {
        revolutionId,
        isPublished: true,
        title: { not: "" },
        ...(onlyActive ? { updatedAt: { gt: subDays(new Date(), 7) } } : {}),
      },
      orderBy: { updatedAt: "desc" },
      take,
    });

    return stories.map(transformStory);
  },
  undefined,
  { revalidate: 360, tags: ["story"] },
);

const getForUser = unstable_cache(
  async (revolutionId: string, user: `0x${string}`, page: number, take: number) => {
    const stories = await database.story.findMany({
      where: {
        revolutionId,
        isPublished: true,
        team: { hasSome: [user] },
      },
      orderBy: { updatedAt: "desc" },
      take,
      skip: take * (page - 1),
    });

    return stories.map(transformStory);
  },
  undefined,
  { revalidate: 600, tags: ["story"] },
);

const countForUser = unstable_cache(
  async (revolutionId: string, user: `0x${string}`) => {
    return await database.story.count({
      where: {
        revolutionId,
        isPublished: true,
        team: { hasSome: [user] },
      },
    });
  },
  undefined,
  { revalidate: 600, tags: ["story"] },
);

export const generateSlug = async (title: string): Promise<string> => {
  const id = `${title}-${Date.now().toString().slice(-6)}`;

  return slugify(id, { lower: true, strict: true, trim: true });
};

async function create(data: Omit<Prisma.StoryCreateInput, "slug" | "body">) {
  const slug = await generateSlug(data.title);

  const story = await database.story.create({
    data: {
      ...data,
      slug,
      body: "[]", // backwards compatibility with the old story editor
    },
  });

  revalidateTag("story");

  return transformStory(story);
}

async function update(slug: string, data: Omit<Prisma.StoryUpdateInput, "slug">) {
  const story = await database.story.update({ where: { slug }, data });
  revalidateTag("story");
  return transformStory(story);
}

const getForGrant = unstable_cache(
  async (alloProfileId: string, take = 12) => {
    const stories = await database.story.findMany({
      where: {
        isPublished: true,
        alloProfileId,
        OR: [{ isFile: false }, { isFile: { isSet: false } }],
      },
      orderBy: { updatedAt: "desc" },
      take,
    });

    return stories.map(transformStory);
  },
  undefined,
  { revalidate: 360, tags: ["story"] },
);

const getForLeaderboard = unstable_cache(
  async (revolutionId: string) => {
    const users: Record<string, number> = {};

    function incrementForUser(address: string) {
      users[address] = users[address] ? users[address] + 1 : 1;
    }

    const stories = await database.story.findMany({
      where: {
        revolutionId,
        isPublished: true,
        alloProfileId: { not: null },
        updatedAt: { gt: subDays(new Date(), 7) },
      },
    });

    stories.forEach(story => {
      story.team.forEach(user => incrementForUser(user));
      story.contributors.forEach(user => incrementForUser(user.address));
    });

    return Object.entries(users)
      .map(([user, count]) => ({ user, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  },
  undefined,
  { revalidate: 720, tags: ["story"] },
);
