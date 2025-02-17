import {
  CultureIndexMediaType,
  CultureIndexRequiredMediaPrefix,
} from "@cobuild/libs/web3/revolution/types";
import { RevolutionDeployArgs } from "../../types/RevolutionBuilder";

export const args: RevolutionDeployArgs = [
  //initial owner
  "0x289715fFBB2f4b482e2917D2f183FeAb564ec84F", // TODO change to my ledger
  //base weth address
  "0x4200000000000000000000000000000000000006",
  //revolution token
  {
    name: "Vrbs TEST",
    symbol: "VRB",
    contractURIHash: "ipfs://QmZi1n79FqWt2tTLwCqiy6nLM6xLGRsEPQ5JmReJQKNNzX", // TODO change to actual hash
    tokenNamePrefix: "TEST",
  },
  //auction
  {
    timeBuffer: BigInt(300), // 5 minutes
    reservePrice: BigInt(1), // not 0
    duration: BigInt(864), // 1 day
    minBidIncrementPercentage: 2, // 2%
    minCreatorRateBps: BigInt(250), // 2.5%
    creatorRateBps: BigInt(2000), // 20%
    entropyRateBps: BigInt(5000), // 50% - so 10/10 votes/eth
    grantsParams: {
      totalRateBps: BigInt(0),
      grantsAddress: "0x1e181311A44E71c4584855e70f7CAbD87366D5E8", // TODO change to multisig
    },
  },
  //dao
  {
    // TODO revisit https://etherscan.io/tx/0x4e064817c4fac01d46e35bc6250da7d858a2101195baf2be6da435498984d6c4#eventlog
    // seconds
    timelockDelay: BigInt(172800), // 2 days
    // blocks
    votingDelay: BigInt(1296), // nouns is 21600 blocks (delay + update period), base block time is 2s, eth is 12s so 21600 * 6
    // blocks
    votingPeriod: BigInt(1728), // nouns is 28800 blocks, base block time is 2s, eth is 12s so 28800 * 6
    // how much you need to make a proposal
    proposalThresholdBPS: BigInt(500), // 5% to start, can bring down after treasury grows
    vetoer: "0x1e181311A44E71c4584855e70f7CAbD87366D5E8", // TODO change to multisig
    name: "Vrbs TEST DAO",
    flag: "▀▄▀",
    // todo change this to empowering creators, accessibilty, encouraging participation
    purpose:
      "Do good with no expectation of return. Create positive externalities. Embrace absurdity & difference. Teach people about vrbs & crypto. Have fun.",
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
    tokenParams: { name: "Vrb TEST Votes", symbol: "VRBS" },
    emitterParams: {
      // Start out expensive and don't decay too quickly if behind schedule
      // We want to incentivize people to bid on the auction
      vrgdaParams: {
        targetPrice: BigInt(1.5 * 1e16), // 0.015 ETH
        priceDecayPercent: BigInt(1.5 * 1e17), // 15% per day
        tokensPerTimeUnit: BigInt(1000 * 1e18), // 1000 tokens per day
      }, // decayRate, targetPrice, perTimeUnit
      grantsParams: {
        totalRateBps: BigInt(0),
        grantsAddress: "0x1e181311A44E71c4584855e70f7CAbD87366D5E8", // TODO change to multisig
      },
      founderParams: {
        founderAddress: "0x1e181311A44E71c4584855e70f7CAbD87366D5E8", // TODO change to multisig
        totalRateBps: BigInt(1500), // 15% founder rate
        entropyRateBps: BigInt(0), // 0% entropy
        rewardsExpirationDate: BigInt(1772736285),
      },
    },
  },
  //voting power
  {
    tokenVoteWeight: BigInt(1e18 * 1000),
    pointsVoteWeight: BigInt(1),
  },
];
