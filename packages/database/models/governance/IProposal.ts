import { Profile, Proposal, TrackerType } from "prisma-database";
import { IVote } from "./IVote";
import { PresetOption } from "@cobuild/libs/governance/voting";

export type ExecutionData = Array<{
  target: string;
  calldata?: `0x${string}`;
  signature?: string;
  value: { eth?: number; quantity?: number; abi?: any };
}>;

export interface ProposalOption {
  name: string;
  preset: PresetOption | null;
  voteCount: string;
  uniqueVotes: number;
  executionData: ExecutionData;
  optionId: number;
  color?: string;
}

export interface IProposal extends Omit<Proposal, "options"> {
  budget: { amount: number; unit: "eth" | "usd" };
  transactions: string;
  profile?: Pick<Profile, "profilePicture" | "username">;
  votes?: IVote[];
  proposer: `0x${string}`;
  myVote?: string;
  numericId: number | null;
  votesCount: {
    total: string;
    totalUnique: number;
    for: string;
    against: string;
    abstain: string;
  };
  options: ProposalOption[];
  hasPresetOptions: boolean;
  quorum: () => Promise<bigint>;
}

// Type for the options stored in the database
// We store it as JSON, so we don't have this defined in Prisma
export type ProposalOptionsDB = Record<
  number,
  {
    name: string;
    voteCount: string | null;
    uniqueVotes: number | null;
    executionData: Array<{ target: string; value: { eth: number; quantity: number } }>;
  }
>;
