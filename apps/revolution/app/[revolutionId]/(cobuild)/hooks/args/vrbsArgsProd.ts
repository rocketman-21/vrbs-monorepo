import {
  CultureIndexMediaType,
  CultureIndexRequiredMediaPrefix,
} from "@cobuild/libs/web3/revolution/types";
import { RevolutionDeployArgs } from "../../types/RevolutionBuilder";

export const args: RevolutionDeployArgs = [
  //initial owner
  "0xf9A74148AaA8Ff9FcE8Af63c92B8386E0AAE2ce0", // rocketman Vrbs Signer
  //base weth address
  "0x4200000000000000000000000000000000000006",
  //revolution token
  {
    name: "Vrbs",
    symbol: "VRB",
    contractURIHash: "ipfs://QmUqA276B3e5ELzTfHfivtcnhHRqHesJp7Rinq8iac6gEm", // vrbs collection URI
    tokenNamePrefix: "Vrb",
  },
  //auction
  {
    timeBuffer: BigInt(300), // 5 minutes
    reservePrice: BigInt(1), // not 0
    duration: BigInt(86400), // 1 day
    minBidIncrementPercentage: 2, // 2%
    minCreatorRateBps: BigInt(250), // 2.5%
    creatorRateBps: BigInt(2000), // 20%
    entropyRateBps: BigInt(5000), // 50% - so 10/10 votes/eth
    grantsParams: {
      totalRateBps: BigInt(0),
      grantsAddress: "0xE97D69bec794C4236d9A529efB886199BDbD3f25", // architects multisig on Base
    },
  },
  //dao
  {
    // TODO revisit https://etherscan.io/tx/0x4e064817c4fac01d46e35bc6250da7d858a2101195baf2be6da435498984d6c4#eventlog
    // seconds
    timelockDelay: BigInt(172800), // 2 days
    // blocks
    votingDelay: BigInt(129600), // nouns is 21600 blocks (delay + update period), base block time is 2s, eth is 12s so 21600 * 6
    // blocks
    votingPeriod: BigInt(172800), // nouns is 28800 blocks, base block time is 2s, eth is 12s so 28800 * 6
    // how much you need to make a proposal
    proposalThresholdBPS: BigInt(500), // 5% to start, can bring down after treasury grows
    vetoer: "0xE97D69bec794C4236d9A529efB886199BDbD3f25", // architects multisig on Base
    name: "Vrbs DAO",
    flag: "▀▄▀",
    purpose:
      "Do good with no expectation of return. Steward public spaces. Create positive externalities. Empower people to uplift their communities. Embrace absurdity & difference. Teach people about Vrbs & crypto. Dare greatly. Have fun.",
    // same as nouns
    dynamicQuorumParams: {
      minQuorumVotesBPS: 1000,
      maxQuorumVotesBPS: 1500,
      quorumCoefficient: 1000000,
    },
  },
  //culture index
  {
    name: "Vrbs Art Race",
    description: "Create the next Vrb. Become a part of Vrbs history.",
    template: "ipfs://QmRH5Ht68hk6wEYCndCey2SCXDxgpf5B6qAGCZy4Ah9zxG",
    checklist: `
- Original 32x32 pixel art
- Feature ⌐◨-◨ in the correct location
`,
    tokenVoteWeight: BigInt(1e18 * 1000),
    pointsVoteWeight: BigInt(1),
    pieceMaximums: {
      name: BigInt(210),
      description: BigInt(2_000),
      image: BigInt(64_000),
      text: BigInt(100_000),
      animationUrl: BigInt(1_000),
    },
    quorumVotesBPS: BigInt(250), // 2.5%
    minVotingPowerToCreate: BigInt(0),
    minVotingPowerToVote: BigInt(1),
    requiredMediaType: CultureIndexMediaType.IMAGE,
    requiredMediaPrefix: CultureIndexRequiredMediaPrefix.SVG,
  },
  //revolution points
  {
    tokenParams: { name: "Vrb Votes", symbol: "VRBS" },
    emitterParams: {
      // Start out expensive and don't decay too quickly if behind schedule
      // We want to incentivize people to bid on the auction
      vrgdaParams: {
        targetPrice: BigInt(1.5 * 1e16), // 0.015 ETH
        priceDecayPercent: BigInt(1.5 * 1e17), // 15% per day scaled by 1e18
        tokensPerTimeUnit: BigInt(1000 * 1e18), // 1000 tokens per day scaled by 1e18
      }, // decayRate, targetPrice, perTimeUnit
      grantsParams: {
        totalRateBps: BigInt(0),
        grantsAddress: "0xE97D69bec794C4236d9A529efB886199BDbD3f25", // architects multisig on Base
      },
      founderParams: {
        founderAddress: "0xE97D69bec794C4236d9A529efB886199BDbD3f25", // architects multisig on Base
        totalRateBps: BigInt(1500), // 15% founder rate
        entropyRateBps: BigInt(0), // 0% entropy
        rewardsExpirationDate: BigInt(1804262212), // Friday March 5th, 2027 - 3 yrs
      },
    },
  },
  //voting power
  {
    tokenVoteWeight: BigInt(1e18 * 1000),
    pointsVoteWeight: BigInt(1),
  },
];
