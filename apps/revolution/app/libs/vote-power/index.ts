import "server-only";

import { cacheResult } from "@cobuild/libs/cache";
import { getUser } from "@cobuild/libs/user/server";
import { cache } from "react";
import { getGovernancePower } from "./governancePower";
import { getVotingPower } from "./votingPower";

export const getUserPower = cache(async (revolutionId: string) => {
  try {
    const user = await getUser(revolutionId);
    if (!user) throw new Error("User not found");

    const [votingPower, governancePower] = await Promise.all([
      cacheResult(`votingPower_${user}_${revolutionId}`, 30, async () =>
        getVotingPower(user, revolutionId),
      ),
      cacheResult(`governancePower_${user}_${revolutionId}`, 30, async () =>
        getGovernancePower(user, revolutionId),
      ),
    ]);

    return { votingPower, governancePower };
  } catch (e: any) {
    if (e.message !== "User not found") {
      console.error("Error checking user-power", e);
    }
    return { votingPower: "0", governancePower: "0" };
  }
});
