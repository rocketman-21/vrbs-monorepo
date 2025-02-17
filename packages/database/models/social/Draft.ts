import "server-only";

import { Draft } from "prisma-database";
import { IDraft } from "./IDraft";

export function transformDraft(draft: Draft): IDraft {
  return Object.assign(draft, {
    address: draft.address as `0x${string}`,
    team: draft.team as `0x${string}`[],
    canBeEditedBy: (user: `0x${string}` | null) => canBeEditedBy(user, draft),
    canBeManagedBy: (user: `0x${string}` | null) => canBeManagedBy(user, draft),
  });
}

function canBeEditedBy(user: `0x${string}` | null, draft: Draft) {
  if (!user) return false;
  return draft.address === user || draft.team.includes(user);
}

function canBeManagedBy(user: `0x${string}` | null, draft: Draft) {
  return canBeEditedBy(user, draft);
}
