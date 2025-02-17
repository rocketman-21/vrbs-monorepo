import { getEthAddress } from "@cobuild/libs/utils/account";
import { database } from "../../..";
import { transformContest } from "./Contest";
import { IContest } from "./IContest";

export function Contests() {
  return {
    getByAddress,
    getForGoal,
    getAllCultureIndexes,
    getForRevolution,
  };
}

async function getByAddress(address: string, chainId: number): Promise<IContest> {
  const contest = await database.contest.findFirstOrThrow({ where: { address, chainId } });
  return transformContest(contest);
}

async function getForGoal(goal: string, revolutionId: string): Promise<IContest[]> {
  const contests = await database.contest.findMany({ where: { goal, revolutionId } });
  return await Promise.all(contests.map(transformContest));
}

async function getForRevolution(revolutionId: string): Promise<IContest[]> {
  const contests = await database.contest.findMany({
    where: { revolutionId },
    orderBy: { createdAt: "desc" },
  });
  return await Promise.all(contests.map(transformContest));
}

async function getAllCultureIndexes(): Promise<Array<{ chainId: number; address: `0x${string}` }>> {
  const contests = await database.contest.findMany();

  return contests.map(({ chainId, cultureIndexAddress }) => ({
    chainId,
    address: getEthAddress(cultureIndexAddress),
  }));
}
