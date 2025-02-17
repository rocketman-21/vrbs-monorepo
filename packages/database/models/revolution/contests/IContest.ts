import type { ContestData } from "@cobuild/libs/revolution/contest";
import type { Contest } from "prisma-database";

export type IContest = ContestData & {
  name: string;
  description: string;
  url: string;
} & Pick<Contest, "revolutionId" | "goal" | "imageUrl">;
