import {
  CultureIndexMediaType,
  CultureIndexRequiredMediaPrefix,
} from "@cobuild/libs/web3/revolution/types";
import { RevolutionDeployArgs } from "../../types/RevolutionBuilder";

export const args: RevolutionDeployArgs = [
  //initial owner
  "0xf9A74148AaA8Ff9FcE8Af63c92B8386E0AAE2ce0", // rocketman Vrbs Signer
  //optimism weth address
  "0x4200000000000000000000000000000000000006",
  //revolution token
  {
    name: "Downhill Nouns",
    symbol: "DHS",
    contractURIHash: "ipfs://QmRmCHYEtBS9UFSibchFRvc3NEZsqBhcREHBiFJgpxujeF", //
    tokenNamePrefix: "DH Noun",
  },
  //auction
  {
    timeBuffer: BigInt(300), // 5 minutes
    reservePrice: BigInt(1), // not 0
    duration: BigInt(86400), // 1 day
    minBidIncrementPercentage: 2, // 2%
    minCreatorRateBps: BigInt(250), // 2.5%
    creatorRateBps: BigInt(4000), // 40%
    entropyRateBps: BigInt(2500), // 25% - so 30/10 votes/eth
    grantsParams: {
      totalRateBps: BigInt(0),
      grantsAddress: "0xAE353195A9ED52B36fC2A7022213517217F6fAcB", // multisig on op
    },
  },
  //dao
  {
    // seconds
    timelockDelay: BigInt(172800), // 2 days
    // blocks
    votingDelay: BigInt(259200), // nouns is 21600 blocks (delay + update period), optimism block time is 1s, eth is 12s so 21600 * 12
    // blocks
    votingPeriod: BigInt(345600), // nouns is 28800 blocks, optimism block time is 1s, eth is 12s so 28800 * 12
    // how much you need to make a proposal
    proposalThresholdBPS: BigInt(250), // 2.5% to start
    vetoer: "0xAE353195A9ED52B36fC2A7022213517217F6fAcB", // founder multisig on op
    name: "DHNOUNS DAO",
    flag: "⌐D-H",
    purpose: `Share our love for speed and respect for the mountains. Support and grow local communities. Empower athletes and content creators. Share our dream to build our decentralized downhill revolution, together.`,
    // same as nouns
    dynamicQuorumParams: {
      minQuorumVotesBPS: 1000,
      maxQuorumVotesBPS: 1500,
      quorumCoefficient: 1000000,
    },
  },
  //culture index
  {
    name: "Series DH Gnarly",
    description: "Amantes de la velocidad, comparte tu talento, amor y respeto por las montañas.",
    template: "",
    checklist: `
- keep the spirit  ⌐D-H
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
    requiredMediaType: CultureIndexMediaType.NONE,
    requiredMediaPrefix: CultureIndexRequiredMediaPrefix.MIXED,
  },
  //revolution points
  {
    tokenParams: { name: "Downhill Votes", symbol: "VDH" },
    emitterParams: {
      // Start out expensive and don't decay too quickly if behind schedule
      // We want to incentivize people to bid on the auction
      vrgdaParams: {
        targetPrice: BigInt(1.5 * 1e14), // 0.00015 ETH
        priceDecayPercent: BigInt(1.5 * 1e17), // 15% per day scaled by 1e18
        tokensPerTimeUnit: BigInt(1000 * 1e18), // 1000 tokens per day scaled by 1e18
      }, // decayRate, targetPrice, perTimeUnit
      grantsParams: {
        totalRateBps: BigInt(0),
        grantsAddress: "0xAE353195A9ED52B36fC2A7022213517217F6fAcB", // founders multisig on op
      },
      founderParams: {
        founderAddress: "0xAE353195A9ED52B36fC2A7022213517217F6fAcB", // founders multisig on op
        totalRateBps: BigInt(2500), // 25% founder rate
        entropyRateBps: BigInt(1000), // 10% entropy
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
