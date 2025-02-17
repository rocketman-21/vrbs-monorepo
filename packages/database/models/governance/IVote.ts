import { Vote, Profile } from "prisma-database";

export interface IVote extends Vote {
  profile?: Pick<Profile, "username" | "profilePicture"> | null;
}
