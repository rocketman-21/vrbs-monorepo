import "server-only";

import { Idea as IdeaRaw } from "prisma-database";
import { Profile } from "../../types";
import { Idea } from "./IdeaInterface";
import { transformProfile } from "./Profile";

export function transformIdea(idea: IdeaRaw & { profile?: Profile | null }): Idea {
  return Object.assign(idea, {
    creator: idea.creator as `0x${string}`,
    profile: idea.profile ? transformProfile(idea.profile) : undefined,
    canBeEditedBy: (user: `0x${string}` | null) => canBeEditedBy(user, idea),
    voteOf: (address?: string | null) =>
      idea.votes.find(v => v.address === address)?.value as 1 | -1 | undefined,
    upvoters: () => getUpvoters(idea),
    downvoters: () => getDownvoters(idea),
  });
}

function canBeEditedBy(user: `0x${string}` | null, idea: IdeaRaw) {
  if (!user) return false;
  return idea.creator === user;
}

function getUpvoters(idea: IdeaRaw) {
  return idea.votes.filter(vote => vote.value === 1).map(vote => vote.address);
}

function getDownvoters(idea: IdeaRaw) {
  return idea.votes.filter(vote => vote.value === -1).map(vote => vote.address);
}
