import {
  CultureIndexMediaType,
  CultureIndexRequiredMediaPrefix,
} from "@cobuild/libs/web3/revolution/types";
import { RevolutionDeployArgs } from "../../types/RevolutionBuilder";

export const args: RevolutionDeployArgs = [
  //initial owner
  "0xAC11CAA24071d28C8853054D1658A84E64954A1e",
  //base weth address
  "0x4200000000000000000000000000000000000006",
  //revolution token
  {
    name: "Grounds",
    symbol: "GRND",
    contractURIHash: "ipfs://QmZi1n79FqWt2tTLwCqiy6nLM6xLGRsEPQ5JmReJQKNNzX",
    tokenNamePrefix: "Ground",
  },
  //auction
  {
    timeBuffer: BigInt(120),
    reservePrice: BigInt(1),
    duration: BigInt(1200),
    minBidIncrementPercentage: 2,
    minCreatorRateBps: BigInt(500),
    creatorRateBps: BigInt(2000),
    entropyRateBps: BigInt(2500),
    grantsParams: {
      totalRateBps: BigInt(0),
      grantsAddress: "0x1e181311A44E71c4584855e70f7CAbD87366D5E8",
    },
  },
  //dao
  {
    timelockDelay: BigInt(172800),
    votingDelay: BigInt(15920),
    votingPeriod: BigInt(33200),
    proposalThresholdBPS: BigInt(1),
    vetoer: "0x1e181311A44E71c4584855e70f7CAbD87366D5E8",
    name: "Grounds",
    flag: "⌐⬓",
    purpose:
      "Explore new tastes, cultivate the best beans, sustainably farm, have fun with friends, and love coffee.",
    dynamicQuorumParams: {
      minQuorumVotesBPS: 1000,
      maxQuorumVotesBPS: 1500,
      quorumCoefficient: 1000000,
    },
  },
  //culture index
  {
    name: "Grounds Art Race",
    description: "Create the next Ground. Become a part of Grounds history.",
    template: "ipfs://QmRH5Ht68hk6wEYCndCey2SCXDxgpf5B6qAGCZy4Ah9zxG",
    checklist: `
- [ ] Must be original artwork
- [ ] Must be square, at least 1000x1000
- [ ] Must include ⌐◨-◨ in the fixed location
`,
    tokenVoteWeight: BigInt(1e18 * 1000),
    pointsVoteWeight: BigInt(1),
    quorumVotesBPS: BigInt(500),
    minVotingPowerToCreate: BigInt(0),
    minVotingPowerToVote: BigInt(1),
    requiredMediaType: CultureIndexMediaType.NONE,
    requiredMediaPrefix: CultureIndexRequiredMediaPrefix.MIXED,
    pieceMaximums: {
      name: BigInt(1e2),
      description: BigInt(1e3),
      image: BigInt(64_000),
      text: BigInt(100_000),
      animationUrl: BigInt(1_000),
    },
  },
  //revolution points
  {
    tokenParams: { name: "Ground Points", symbol: "GRNDS" },
    emitterParams: {
      // Start out expensive and don't decay too quickly if behind schedule
      // We want to incentivize people to bid on the auction
      vrgdaParams: {
        targetPrice: BigInt(1e14), // 0.0001 ETH for testing
        priceDecayPercent: BigInt(1e18 / 10), // 10% per day
        tokensPerTimeUnit: BigInt(1e18 * 1000), // 1000 tokens per day
      }, // decayRate, targetPrice, perTimeUnit
      grantsParams: {
        totalRateBps: BigInt(0),
        grantsAddress: "0x1e181311A44E71c4584855e70f7CAbD87366D5E8",
      },
      founderParams: {
        founderAddress: "0x1e181311A44E71c4584855e70f7CAbD87366D5E8",
        totalRateBps: BigInt(1000), // 10% founder rate
        entropyRateBps: BigInt(0), // 0% entropy
        rewardsExpirationDate: BigInt(1707695369 * 2),
      },
    },
  },
  //voting power
  {
    tokenVoteWeight: BigInt(1e18 * 1000),
    pointsVoteWeight: BigInt(1),
  },
];
