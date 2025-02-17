import "server-only";

import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { unstable_cache } from "next/cache";
import { getNounishGovernancePower } from "./nounishGovernancePower";
import { getVotingPower } from "./votingPower";

export const getGovernancePower = unstable_cache(
  async (address: `0x${string}`, revolutionId: string) => {
    const revolution = await Revolutions().getById(revolutionId);
    if (!revolution) throw new Error("Invalid revolutionId");

    const { addresses, chainId, tokenContract } = revolution;

    // Revolution voting power is the same as governance power
    if (addresses?.revolutionVotingPower && chainId) {
      return await getVotingPower(address, revolutionId);
    }

    // Nounish governance power
    if (tokenContract && chainId) {
      return await getNounishGovernancePower(address, tokenContract, chainId, revolutionId);
    }

    return "0";
  },
  undefined,
  { revalidate: 10 },
);
