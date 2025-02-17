import { Draft, Profile } from "prisma-database";

export interface IDraft extends Draft {
  profile?: Pick<Profile, "username" | "profilePicture">;
  address: `0x${string}`;
  team: `0x${string}`[];
  canBeEditedBy: (user: `0x${string}` | null) => boolean;
  canBeManagedBy: (user: `0x${string}` | null) => boolean;
}
