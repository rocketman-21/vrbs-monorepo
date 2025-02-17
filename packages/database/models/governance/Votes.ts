import "server-only";

import Fuse from "fuse.js";
import { cache } from "react";
import { database } from "../../";
import { IVote } from "./IVote";

export function Votes() {
  return Object.assign(database.vote, {
    findForProposal,
    findForUser,
  });
}

const findForProposal = cache(
  async (proposalId: string, entityId: string, optionId?: number, phrase?: string) => {
    const votes: IVote[] = await database.vote.findMany({
      where: { proposalId, entityId, ...(typeof optionId !== undefined ? { optionId } : {}) },
      orderBy: { votedAt: { time: "desc" } },
      include: { profile: { select: { username: true, profilePicture: true } } },
      // cacheStrategy: { swr: 30 },
    });

    if (!phrase || phrase.length < 1) return votes;

    const fuse = new Fuse(votes, {
      threshold: 0.3,
      keys: ["profile.username", "reason"],
      distance: 1000,
    });

    return fuse.search(phrase).map(result => result.item);
  },
);

const findForUser = cache(async (address?: string | null, entityId?: string) => {
  if (!address || address.length < 20) return [];

  const votes = await Votes().findMany({
    where: { ...(entityId ? { entityId } : undefined), voter: address },
    orderBy: { votedAt: { time: "desc" } },
    select: { proposalId: true, optionId: true },
    take: 250,
    // cacheStrategy: { ttl: 10 },
  });

  return votes.map(v => ({ ...v, optionId: Number(v.optionId) }));
});
