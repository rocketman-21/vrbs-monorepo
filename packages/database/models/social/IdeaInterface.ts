import { Idea as IdeaRaw } from "prisma-database";
import { IProfile } from "./IProfile";

export interface Idea extends IdeaRaw {
  creator: `0x${string}`;
  profile?: IProfile;
  canBeEditedBy: (address: `0x${string}` | null) => boolean;
  voteOf: (address?: `0x${string}` | null) => 1 | -1 | undefined;
  upvoters: () => string[];
  downvoters: () => string[];
}
