import "server-only";

import { CastWithInteractions } from "@cobuild/libs/farcaster/client";
import { Cast } from "prisma-database";

export function transformCast(cast: Cast): CastWithInteractions & { revolutionId: string } {
  return Object.assign(cast, {}) as any satisfies CastWithInteractions & { revolutionId: string };
}
