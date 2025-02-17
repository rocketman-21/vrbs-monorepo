import { useCheckWallet } from "@cobuild/libs/hooks/useCheckWallet";
import { useWalletError } from "@cobuild/libs/hooks/useWalletError";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { revolutionBuilderAbi } from "@cobuild/revolution";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useEffect } from "react";
import { useSimulateContract, useWriteContract } from "wagmi";
import { REVOLUTION_BUILDER_ADDRESSES } from "@cobuild/database/models/revolution/revolutions/addresses";
import { useWaitForTransaction } from "app/libs/useWaitForTransaction";
import {
  CultureIndexMediaType,
  CultureIndexRequiredMediaPrefix,
} from "@cobuild/libs/web3/revolution/types";

export const useDeployRevolution = (onSuccess: (hash: `0x${string}`) => void, chainId: number) => {
  const contract = REVOLUTION_BUILDER_ADDRESSES[chainId];

  const { checkWallet, walletChain, connectedAddress } = useCheckWallet(chainId);
  const { reportWalletError } = useWalletError();

  const { data: simulateData, error: prepareError } = useSimulateContract({
    address: contract,
    abi: revolutionBuilderAbi,
    chainId,
    functionName: "deploy",
    args: [
      //initial owner
      "0x289715fFBB2f4b482e2917D2f183FeAb564ec84F", //rocketman
      //base weth address
      "0x4200000000000000000000000000000000000006",
      //revolution token
      {
        name: "Token8",
        symbol: "TKN8T",
        contractURIHash: "Qmcu3krDaErYhbsG8Fgs98HvF2BoXWdE3WD1AwNubNBAuB",
        tokenNamePrefix: "TKN8T",
      },
      //auction
      {
        timeBuffer: BigInt(300), // 5 minutes
        reservePrice: BigInt(10000000000000000), // 0.01 ETH
        duration: BigInt(86400),
        minBidIncrementPercentage: 10, // 10%
        minCreatorRateBps: BigInt(250), // 2.5%
        creatorRateBps: BigInt(5000), // 50%
        entropyRateBps: BigInt(8000), // 80%
        grantsParams: {
          totalRateBps: BigInt(0),
          grantsAddress: "0x7B2A7B05389c502162DBd3aCD8BcC75b9C08A360", // multisig for Durian DAO should be ( architects multisig on Base)
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
        vetoer: "0x7B2A7B05389c502162DBd3aCD8BcC75b9C08A360", // DAO Multisig architects multisig on Base
        name: "Token8",
        flag: "∞",
        purpose:
          "Cultivate spaces where technology, art, and community converge to educate, engage, and elevate. Empower creative expression through tokens and gamified community experiences, reinforcing the importance of everyone’s role in co-creating the digital future. Celebrate diversity and the unconventional, exploring the crypto universe with courage, innovation, and joy.",
        dynamicQuorumParams: {
          minQuorumVotesBPS: 1000,
          maxQuorumVotesBPS: 1500,
          quorumCoefficient: 1000000,
        },
      },
      //culture index
      {
        name: "Token8 Art Game",
        description: "Tokenate the next Art piece and unleash the Tokenator inside you!",
        template: "",
        checklist: `
        - original artwork
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
      // points
      {
        tokenParams: { name: "Token8", symbol: "TKN8" },
        emitterParams: {
          // Start out expensive and don't decay too quickly if behind schedule
          // We want to incentivize people to bid on the auction
          vrgdaParams: {
            targetPrice: BigInt(1 * 1e13), // 0.00001 ETH
            priceDecayPercent: BigInt(1.5 * 1e17), // 15% per day scaled by 1e18
            tokensPerTimeUnit: BigInt(1000 * 1e18), // 1000 tokens per day scaled by 1e18
          }, // decayRate, targetPrice, perTimeUnit
          grantsParams: {
            totalRateBps: BigInt(0),
            grantsAddress: "0x7B2A7B05389c502162DBd3aCD8BcC75b9C08A360", // architects multisig on Base
          },
          founderParams: {
            founderAddress: "0x7B2A7B05389c502162DBd3aCD8BcC75b9C08A360", // architects multisig on Base
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
    ],
    query: {
      enabled: chainId === walletChain?.id && !!connectedAddress,
    },
  });

  const { writeContractAsync, isPending: isWriting, data: hash } = useWriteContract({});

  const {
    isLoading: isAwaitingTransaction,
    isSuccess,
    data,
    error: txnError,
  } = useWaitForTransaction({
    chainId,
    hash,
    onSuccess: async receipt => {
      onSuccess(receipt.transactionHash);
    },
  });

  useEffect(() => {
    if (!txnError) return;
    const message = reportWalletError(txnError, "deployRevolution", contract, "deploy");
    toast.error(message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txnError]);

  return {
    deploy: async () => {
      if (prepareError) {
        return toast.error(getErrorMessage(prepareError));
      }

      if ((await checkWallet()) && writeContractAsync && simulateData?.request) {
        await writeContractAsync(simulateData.request);
      }
    },
    isWriting,
    isAwaitingTransaction,
    isSuccess,
    transactionHash: hash,
  };
};
