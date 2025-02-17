import { Profile as AlloProfile } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import { AlloProfile as Grant } from "prisma-database";
import { IProfile } from "../../social/IProfile";
import { IStory } from "../stories/IStory";

export interface IGrant extends Grant {
  url: string;
  absoluteUrl: string;
  team: `0x${string}`[];
  alloProfile: AlloProfile;
  monthlyFlowRate: number;
  monthlyFlowRatePerMember: number;
  contractAddress: `0x${string}` | null;
  memberFlowRate: number;
  memberFlowRatePerMember: number;
  parentPool: `0x${string}`;
  parentContract: `0x${string}`;
  totalVotes: number;
  userVotes: (user: `0x${string}`) => Promise<number>;
  isOpenGrantPool: boolean;
  isApproved: boolean;
  isTopLevel: boolean;
  salaryRecipientAddress: `0x${string}`;
  poolBalance: {
    ethBalance: number;
    claimableBalance: number;
    totalEarned: number;
    usdcBalance: number;
    memberUnits: number;
    superTokenBalance: number;
    isApprovedRecipient: boolean;
    superToken: `0x${string}`;
    claimableBalancePerMember: number;
    totalEarnedPerMember: number;
    superTokenBalancePerMember: number;
  };
  openings: number;
  maxOpenings: number;
  isMemberConnectedToPool: () => Promise<boolean>;
  subgrants: () => Promise<Array<IGrant>>;
  members: () => Promise<Array<IProfile>>;
  parent: () => Promise<IGrant | null>;
  canBeManagedBy: (user: `0x${string}` | null) => boolean;
  canBeUpdatedBy: (user: `0x${string}` | null) => Promise<boolean>;
  stories: () => Promise<Array<IStory>>;
}

export interface IGrantVote {
  recipient: `0x${string}`;
  bps: number;
  memberUnitsDelta: number;
}
