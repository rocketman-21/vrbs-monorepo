"use server";

import { database } from "@cobuild/database";

export async function getPosition(votesWeight: number, contractAddress: string) {
  const count = await database.submission.count({
    where: {
      votesWeight: { gt: votesWeight },
      contractAddress: contractAddress.toLowerCase(),
      hasBeenDropped: false,
    },
  });

  return count + 1;
}
