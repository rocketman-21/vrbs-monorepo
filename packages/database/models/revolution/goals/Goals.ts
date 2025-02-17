import { transformGoal } from "./Goal";
import { IGoal } from "./IGoal";
import { goals as allGoals } from "./goals-data";

export function Goals() {
  return {
    getForRevolution,
    getBySlug,
  };
}

async function getForRevolution(revolutionId: string): Promise<IGoal[]> {
  const goals = allGoals.filter(goal => goal.revolutionId === revolutionId);
  return await Promise.all(goals.map(transformGoal));
}

async function getBySlug(slug: string): Promise<IGoal | null> {
  const goal = allGoals.find(goal => goal.slug === slug);
  return goal ? await transformGoal(goal) : null;
}
