import "server-only";

import { cache } from "react";
import slugify from "slugify";
import { database } from "../..";
import { Revolutions } from "../revolution/revolutions/Revolutions";
import { transformIdea } from "./Idea";

export function Ideas() {
  return Object.assign(database.idea, {
    findById,
    getForRevolution,
    createForRevolution,
    upvote,
    downvote,
    countForRevolution,
  });
}

const findById = cache(async (ideaId: string) => {
  const idea = await database.idea.findFirst({
    where: { ideaId },
    include: { profile: true },
  });
  return idea ? transformIdea(idea) : null;
});

const getForRevolution = async (options: { revolutionId: string }) => {
  const { revolutionId } = options;

  const ideas = (
    await database.idea.findMany({
      where: { revolutionId },
      orderBy: { createdAt: "desc" },
      include: { profile: true },
    })
  ).map(transformIdea);

  return ideas;
};

const countForRevolution = async (revolutionId: string) => {
  return await database.idea.count({ where: { revolutionId } });
};

async function createForRevolution(args: { revolutionId: string; creator: string; body: string }) {
  const { revolutionId, ...rest } = args;

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution) throw new Error(`Revolution ${revolutionId} not found`);

  const count = 1 + (await database.idea.count({ where: { revolutionId } }));
  const ideaId = await generateIdeaId(revolution.name || revolutionId, count);

  const idea = await database.idea.create({
    data: {
      ideaId,
      revolutionId,
      ...rest,
    },
  });

  return transformIdea(idea);
}

export const generateIdeaId = async (entityName: string, count: number): Promise<string> => {
  return slugify(`${entityName}-${count}-${Date.now().toString().slice(-6)}`, {
    lower: true,
    strict: true,
  });
};

const upvote = async (ideaId: string, address: `0x${string}`, revolutionId: string) => {
  const idea = await Ideas().findById(ideaId);
  if (!idea) return;

  const currentVote = idea.votes.find(vote => vote.address === address);

  // User had already upvoted -> remove upvote
  if (currentVote && currentVote.value === 1) {
    return await database.idea.update({
      where: { ideaId },
      data: {
        votes: {
          set: idea.votes.filter(vote => vote.address !== address),
        },
        voteResult: { decrement: 1 },
      },
      select: { voteResult: true },
    });
  }

  // User hadn't voted yet at all -> upvote
  if (!currentVote) {
    return await database.idea.update({
      where: { ideaId },
      data: {
        votes: { push: { address, value: 1 } },
        voteResult: { increment: 1 },
      },
      select: { voteResult: true },
    });
  }

  // User had downvoted earlier -> toggle to upvote
  return await database.idea.update({
    where: { ideaId },
    data: {
      votes: {
        set: [...idea.votes.filter(vote => vote.address !== address), { address, value: 1 }],
      },
      voteResult: { increment: 2 },
    },
    select: { voteResult: true },
  });
};

const downvote = async (ideaId: string, address: `0x${string}`, revolutionId: string) => {
  const idea = await Ideas().findById(ideaId);
  if (!idea) return;

  const currentVote = idea.votes.find(vote => vote.address === address);

  // User had already downvoted -> remove downvote
  if (currentVote && currentVote.value === -1) {
    return await database.idea.update({
      where: { ideaId },
      data: {
        votes: { set: idea.votes.filter(vote => vote.address !== address) },
        voteResult: { increment: 1 },
      },
      select: { voteResult: true },
    });
  }

  // User hadn't voted yet at all -> downvote
  if (!currentVote) {
    return await database.idea.update({
      where: { ideaId },
      data: {
        votes: { push: { address, value: -1 } },
        voteResult: { decrement: 1 },
      },
      select: { voteResult: true },
    });
  }

  // User had upvoted earlier -> toggle to downvote
  return await database.idea.update({
    where: { ideaId },
    data: {
      votes: {
        set: [...idea.votes.filter(vote => vote.address !== address), { address, value: -1 }],
      },
      voteResult: { decrement: 2 },
    },
    select: { voteResult: true },
  });
};
