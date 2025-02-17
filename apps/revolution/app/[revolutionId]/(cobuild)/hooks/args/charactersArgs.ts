import {
  CultureIndexMediaType,
  CultureIndexRequiredMediaPrefix,
} from "@cobuild/libs/web3/revolution/types";
import { RevolutionDeployArgs } from "../../types/RevolutionBuilder";

export const args: RevolutionDeployArgs = [
  //initial owner
  "0x289715fFBB2f4b482e2917D2f183FeAb564ec84F", //rocketman
  //base weth address
  "0x4200000000000000000000000000000000000006",
  //revolution token
  {
    name: "Characters",
    symbol: "CHRCTR",
    contractURIHash: "QmfXpng35eQJSRD8JCuKzDVSC5nC7Yegxo5bWRJWG3o8Zb",
    tokenNamePrefix: "Character",
  },
  //auction
  {
    timeBuffer: BigInt(300), // 5 minutes
    reservePrice: BigInt(3000000000000000), // 0.003 ETH
    duration: BigInt(86400 / 2),
    minBidIncrementPercentage: 10, // 10%
    minCreatorRateBps: BigInt(250), // 2.5%
    creatorRateBps: BigInt(5000), // 50%
    entropyRateBps: BigInt(5000), // 50% - so 10/10 votes/eth
    grantsParams: {
      totalRateBps: BigInt(0),
      grantsAddress: "0x942277d0823120344E608a45e9ff41FeE543F2fC", // multisig for Durian DAO should be ( architects multisig on Base)
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
    proposalThresholdBPS: BigInt(50), // 0.5% to start, can bring down after treasury grows
    vetoer: "0x942277d0823120344E608a45e9ff41FeE543F2fC", // DAO Multisig architects multisig on Base
    name: "Characters",
    flag: ":^)",
    purpose:
      "Characters is a collection of emoticons, and it's all about going the extra mile to be silly, playful and expressive in online social interactions.",
    dynamicQuorumParams: {
      minQuorumVotesBPS: 1000,
      maxQuorumVotesBPS: 1500,
      quorumCoefficient: 1000000,
    },
  },
  //culture index
  {
    name: "Characters Builder",
    description:
      "The Characters Builder is a place where anyone can create and auction their character. Earn 50% of the auction fee, and gain votes to manage the community treasury and curate the collection.",
    template: "",
    checklist: `
    - be an emoticon
    - be expressive
    - be a square □
    - look good as a pfp
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

  // points
  {
    tokenParams: { name: "BOP", symbol: "BOP" },
    emitterParams: {
      // Start out expensive and don't decay too quickly if behind schedule
      // We want to incentivize people to bid on the auction
      vrgdaParams: {
        targetPrice: BigInt(1 * 1e14), // 0.0001 ETH
        priceDecayPercent: BigInt(1.5 * 1e17), // 15% per day scaled by 1e18
        tokensPerTimeUnit: BigInt(1000 * 1e18), // 1000 tokens per day scaled by 1e18
      }, // decayRate, targetPrice, perTimeUnit
      grantsParams: {
        totalRateBps: BigInt(0),
        grantsAddress: "0x942277d0823120344E608a45e9ff41FeE543F2fC", // architects multisig on Base
      },
      founderParams: {
        founderAddress: "0x942277d0823120344E608a45e9ff41FeE543F2fC", // architects multisig on Base
        totalRateBps: BigInt(1500), // 15% founder rate
        entropyRateBps: BigInt(5000), // 50% entropy
        rewardsExpirationDate: BigInt(1804262212), // Friday March 3rd, 2027 - 3 yrs
      },
    },
  },
  //voting power
  {
    tokenVoteWeight: BigInt(1e18 * 1000),
    pointsVoteWeight: BigInt(1),
  },
];
