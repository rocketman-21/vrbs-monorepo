import { RegisteredRevolutionExtension } from "@cobuild/libs/revolution/extensionData";

export interface RevolutionTokenParams {
  name: string;
  symbol: string;
  contractURIHash: string;
  tokenNamePrefix: string;
}

export interface AuctionParams {
  timeBuffer: bigint;
  reservePrice: bigint;
  duration: bigint;
  minBidIncrementPercentage: number;
  creatorRateBps: bigint;
  entropyRateBps: bigint;
  minCreatorRateBps: bigint;
  grantsParams: {
    totalRateBps: bigint;
    grantsAddress: `0x${string}`;
  };
}

export interface GovParams {
  timelockDelay: bigint;
  votingDelay: bigint;
  votingPeriod: bigint;
  proposalThresholdBPS: bigint;
  vetoer: `0x${string}`;
  name: string;
  purpose: string;
  flag: string;
  dynamicQuorumParams: {
    minQuorumVotesBPS: number;
    maxQuorumVotesBPS: number;
    quorumCoefficient: number;
  };
}

export interface CultureIndexParams {
  name: string;
  requiredMediaType: number;
  requiredMediaPrefix: number;
  description: string;
  template: string;
  checklist: string;
  tokenVoteWeight: bigint;
  pointsVoteWeight: bigint;
  quorumVotesBPS: bigint;
  minVotingPowerToVote: bigint;
  minVotingPowerToCreate: bigint;
  pieceMaximums: {
    name: bigint;
    description: bigint;
    image: bigint;
    text: bigint;
    animationUrl: bigint;
  };
}

interface VRGDAParams {
  targetPrice: bigint;
  priceDecayPercent: bigint;
  tokensPerTimeUnit: bigint;
}

export interface RevolutionPointsParams {
  tokenParams: { name: string; symbol: string };
  emitterParams: {
    vrgdaParams: VRGDAParams;
    founderParams: {
      founderAddress: `0x${string}`;
      totalRateBps: bigint;
      entropyRateBps: bigint;
      rewardsExpirationDate: bigint;
    };
    grantsParams: {
      totalRateBps: bigint;
      grantsAddress: `0x${string}`;
    };
  };
}

export interface RevolutionVotingPowerParams {
  tokenVoteWeight: bigint;
  pointsVoteWeight: bigint;
}

export type RevolutionDeployArgs = readonly [
  `0x${string}`,
  `0x${string}`,
  RevolutionTokenParams,
  AuctionParams,
  GovParams,
  CultureIndexParams,
  RevolutionPointsParams,
  RevolutionVotingPowerParams,
];

export interface RevolutionExtensionData {
  name: RegisteredRevolutionExtension;
  executorInitializationData: `0x${string}`;
}

// extension deploymen args
// same as above, but adds a bytes param at the end for extension data
export type DeployRevolutionExtensionArgs = readonly [
  `0x${string}`,
  `0x${string}`,
  RevolutionTokenParams,
  AuctionParams,
  GovParams,
  CultureIndexParams,
  RevolutionPointsParams,
  RevolutionVotingPowerParams,
  RevolutionExtensionData,
];
