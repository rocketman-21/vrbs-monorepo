import { goals } from "./goals-data";
import { IContest } from "../contests/IContest";

export type Goal = (typeof goals)[number];

export type IGoal = Goal & {
  pool: string;
  contests: IContest[];
};
