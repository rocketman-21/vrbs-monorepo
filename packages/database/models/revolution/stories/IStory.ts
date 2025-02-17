import "server-only";

import { CastWithInteractions } from "@cobuild/libs/farcaster/client";
import { Story } from "prisma-database";

export interface IStory extends Story {
  url: string;
  team: `0x${string}`[];
  contributors: { address: `0x${string}`; comment: string }[];
  imageUrl: string;
  canBeEditedBy: (user: `0x${string}` | null) => boolean;
  updates: () => Promise<Array<CastWithInteractions>>;
}
