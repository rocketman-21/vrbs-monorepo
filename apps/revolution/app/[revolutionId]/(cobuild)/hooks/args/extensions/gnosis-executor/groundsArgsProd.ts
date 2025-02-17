import {
  CultureIndexMediaType,
  CultureIndexRequiredMediaPrefix,
} from "@cobuild/libs/web3/revolution/types";
import { DeployRevolutionExtensionArgs } from "../../../../types/RevolutionBuilder";
import { encodeAbiParameters, parseAbiParameters } from "viem";

export const args = [
  //initial owner
  "0x289715fFBB2f4b482e2917D2f183FeAb564ec84F", // rocketman to start
  //base weth address
  "0x4200000000000000000000000000000000000006",
  //revolution token
  {
    name: "Grounds",
    symbol: "GRND",
    contractURIHash: "ipfs://QmXhL9ePvqVFHUwvDoCzkRCd245SH4Go9e9wzzeTY1sz5K",
    tokenNamePrefix: "Ground",
  },
  //auction
  {
    timeBuffer: BigInt(300), // 5 minutes
    reservePrice: BigInt(1), // not 0
    duration: BigInt(86400), // 1 day
    minBidIncrementPercentage: 2, // 2%
    minCreatorRateBps: BigInt(250), // 2.5%
    creatorRateBps: BigInt(4000), // 40%
    entropyRateBps: BigInt(5000), // 50% - so 20/20 votes/eth
    grantsParams: {
      totalRateBps: BigInt(0),
      grantsAddress: "0x46cce6307fb77021aDd11380fb7E249D0fF76A78", // grounds safe
    },
  },
  //dao
  {
    // seconds
    timelockDelay: BigInt(172800), // 2 days
    // blocks
    votingDelay: BigInt(129600), // nouns is 21600 blocks (delay + update period), base block time is 2s, eth is 12s so 21600 * 6
    // blocks
    votingPeriod: BigInt(172800), // nouns is 28800 blocks, base block time is 2s, eth is 12s so 28800 * 6
    // how much you need to make a proposal
    proposalThresholdBPS: BigInt(100), // 1% to start
    vetoer: "0x46cce6307fb77021aDd11380fb7E249D0fF76A78", // grounds safe
    name: "Grounds DAO",
    flag: "⌐⬓",
    purpose:
      "Wake up! Be bold, pour freely, and brew good. Percolate stimulating ideas, with a rich blend of people and cultures. Stay the grind and distribute well. It might be a long shot, but by applying the right pressure, we have a robust opportunity to make a global impact.",
    // same as nouns
    dynamicQuorumParams: {
      minQuorumVotesBPS: 1000,
      maxQuorumVotesBPS: 1500,
      quorumCoefficient: 1000000,
    },
  },
  //culture index
  {
    name: "Grounds Art Race",
    description: "Brew the next Ground. Add your flavor to Grounds history.",
    template: "", // [Note] grounds doesn't have a template
    checklist: `
      - original artwork
      - feature noggles ⌐◨-◨
      - coffee themed
      - square, at least 1000 x 1000 px
      - displays well in small formats (thumbnails, previews, etc)
      - loops smoothly, if animated
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
    requiredMediaPrefix: CultureIndexRequiredMediaPrefix.MIXED,
  },
  //revolution points
  {
    tokenParams: { name: "Magic Internet Beans", symbol: "BEANS" },
    emitterParams: {
      // Start out expensive and don't decay too quickly if behind schedule
      // We want to incentivize people to bid on the auction
      vrgdaParams: {
        targetPrice: BigInt(1.0 * 1e15), // 0.001 ETH
        priceDecayPercent: BigInt(1.5 * 1e17), // 15% per day scaled by 1e18
        tokensPerTimeUnit: BigInt(1000 * 1e18), // 1000 tokens per day scaled by 1e18
      }, // decayRate, targetPrice, perTimeUnit
      grantsParams: {
        totalRateBps: BigInt(0),
        grantsAddress: "0x46cce6307fb77021aDd11380fb7E249D0fF76A78", // grounds safe
      },
      founderParams: {
        founderAddress: "0x12BEEF35025841EFccb77D6EE40df86400Fdb4bB", // Gnosis Guild safe
        totalRateBps: BigInt(1000), // 10% founder rate
        entropyRateBps: BigInt(10000), // 100% entropy
        rewardsExpirationDate: BigInt(2524569000), // Fri Dec 31 2049 13:10:00 GMT+0000
      },
    },
  },
  //voting power
  {
    tokenVoteWeight: BigInt(1e18 * 1000),
    pointsVoteWeight: BigInt(1),
  },
  {
    name: "gnosis.guild.executor",
    // { avatar: address }
    executorInitializationData: encodeAbiParameters(parseAbiParameters("address"), [
      "0x46cce6307fb77021aDd11380fb7E249D0fF76A78",
    ]),
  },
] satisfies DeployRevolutionExtensionArgs;
