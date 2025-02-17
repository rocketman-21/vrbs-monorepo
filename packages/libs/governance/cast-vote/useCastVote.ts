"use client";

import { useCastVoteRevolution } from "./castVoteRevolution";
import { useCastVoteNounsBuilder } from "./useCastVoteNounsBuilder";
import { useCastVoteNounsV1 } from "./useCastVoteNounsV1";
import { useCastVoteNounsV2 } from "./useCastVoteNounsV2";
import { useCastVoteNounsV3 } from "./useCastVoteNounsV3";

export interface CastVoteArgs {
  proposalId: string;
  optionId?: number;
  reason?: string;
  onError: (error: Error & { shortMessage?: string }) => void;
}

export interface CastVoteHookResponse {
  isLoading: boolean;
  hash: `0x${string}` | undefined;
  error: (Error & { shortMessage?: string }) | null;
  write: () => void;
}

export const useCastVote = (
  daoContract: `0x${string}`,
  trackerType: string,
  args: CastVoteArgs,
  chainId: number,
): CastVoteHookResponse => {
  const castVoteNounsV1 = useCastVoteNounsV1(daoContract, args, chainId);
  const castVoteNounsV2 = useCastVoteNounsV2(daoContract, args, chainId);
  const castVoteNounsV3 = useCastVoteNounsV3(daoContract, args, chainId);

  const castVoteNounsBuilder = useCastVoteNounsBuilder(daoContract, args, chainId);
  const castVoteRevolution = useCastVoteRevolution(daoContract, args, chainId);

  switch (trackerType) {
    case "nouns_dao_v1":
      return castVoteNounsV1;
    case "nouns_dao_v2":
      return castVoteNounsV2;
    case "nouns_dao_v3":
      return castVoteNounsV3;
    case "nounsbuilder_v1":
      return castVoteNounsBuilder;
    case "revolution_dao_v1":
      return castVoteRevolution;
    default:
      return {
        hash: undefined,
        isLoading: false,
        write: () => window.alert(`Voting (${trackerType}) not supported yet!`),
        error: null,
      };
  }
};
