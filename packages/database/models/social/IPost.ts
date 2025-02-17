import { Post, Profile } from "prisma-database";

export interface IPost extends Post {
  profile?: Profile;
  children?: IPost[];
  url: (revolutionId: string) => string | null;
}
