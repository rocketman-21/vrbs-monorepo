"use server";

import { database } from "@cobuild/database";
import { getUser } from "@cobuild/libs/user/server";

export async function updateContest(
  address: string,
  revolutionId: string,
  goal: string,
  imageUrl: string,
) {
  const user = await getUser(revolutionId);
  if (!user) throw new Error("Unauthorized");

  const contest = await database.contest.findFirst({ where: { address } });

  if (!contest) throw new Error("Contest not found");
  if (contest.revolutionId !== "unknown") throw new Error("Already updated");

  await database.contest.update({
    where: { address },
    data: { revolutionId, goal, imageUrl: imageUrl || null },
  });

  console.debug(`Contest ${address} updated with revolutionId ${revolutionId} and goal ${goal}`);

  return true;
}
