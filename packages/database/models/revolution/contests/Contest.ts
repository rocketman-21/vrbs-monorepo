import "server-only";

import { getContestData } from "@cobuild/libs/revolution/contest";
import { getEthAddress } from "@cobuild/libs/utils/account";
import { Contest } from "prisma-database";
import { IContest } from "./IContest";

export async function transformContest(contest: Contest): Promise<IContest> {
  const onchainData = await getContestData(getEthAddress(contest.address), contest.chainId);

  return Object.assign(contest, {
    ...onchainData,
    name: onchainData.cultureIndex.name,
    description: onchainData.cultureIndex.description,
    url: `/${contest.revolutionId}/contests/${contest.chainId}/${contest.address}`,
  });
}
