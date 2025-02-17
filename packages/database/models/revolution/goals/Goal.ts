import "server-only";

import { Contests } from "../contests/Contests";
import { Goal, IGoal } from "./IGoal";

export async function transformGoal(goal: Goal): Promise<IGoal> {
  const contests = await Contests().getForGoal(goal.slug, goal.revolutionId);

  return Object.assign(goal, {
    contests,
    pool: contests.reduce((acc, contest) => acc + Number(contest.balance), 0).toString(),
  });
}
