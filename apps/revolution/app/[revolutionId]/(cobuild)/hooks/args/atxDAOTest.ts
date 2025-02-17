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
    name: "ATX DAO",
    symbol: "ATX",
    contractURIHash: "ipfs://Qmczwh2L1zsrYXQzonTPWQfuCAjD4eRkKt6WAU8R9a84zp", // TODO change to actual hash
    tokenNamePrefix: "ATX Noun",
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
    name: "ATX DAO",
    flag: "ATX",
    purpose:
      "Unite Austin's crypto communities. Enable local artists and businesses to participate in the crypto ecosystem. Educate the government about the benefits of Web3. Make Austin a better place for everyone, and have fun doing it.",
    // same as nouns
    dynamicQuorumParams: {
      minQuorumVotesBPS: 1000,
      maxQuorumVotesBPS: 1500,
      quorumCoefficient: 1000000,
    },
  },
  //culture index
  {
    name: "ATX Art Race",
    description: "Create our membership art. Become a part of ATX DAO history.",
    template: "",
    checklist: `
- Original art
- Feature ⌐◨-◨
- Represent Austin well
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
    tokenParams: { name: "ATX DAO Votes", symbol: "ATXV" },
    emitterParams: {
      // Start out expensive and don't decay too quickly if behind schedule
      // We want to incentivize people to bid on the auction
      vrgdaParams: {
        targetPrice: BigInt(1.5 * 1e14), // 0.00015 ETH
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
