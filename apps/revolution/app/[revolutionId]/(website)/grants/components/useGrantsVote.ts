"use client";

import { useUser } from "@cobuild/libs/hooks/useUser";
import { useEffect, useState } from "react";
import { useContractWrite } from "app/libs/useContractWrite";
import { useRevolution } from "app/libs/useRevolution";
import { revolutionGrantsAbi } from "@cobuild/revolution";
import { getChain } from "@cobuild/libs/web3/utils";
import { useRouter } from "next/navigation";
import { IGrantVote } from "@cobuild/database/types";
import { deleteCacheResult } from "@cobuild/libs/cache";

export type UserVoteStatus = "voted" | "not-voted" | "cant-vote" | "guest";

export const PERCENTAGE_SCALE = 1e6;

export function useGrantsVote(
  userVotes: Array<Pick<IGrantVote, "bps" | "recipient">>,
  contract: `0x${string}`,
) {
  const { isAuthenticated, votingPower, user } = useUser();
  const { chainId } = useRevolution();
  const [status, setStatus] = useState<UserVoteStatus>("guest");
  const [votes, setVotes] = useState<Array<Pick<IGrantVote, "bps" | "recipient">>>(userVotes);
  const router = useRouter();

  const { write, status: onchainStatus } = useContractWrite({
    chainId,
    contract,
    type: "voteForGrant",
    // trackerType: "revolution_auction",
    successText: "Votes updated!",
    waitingText: "Updating votes...",
    onSuccess: async () => {
      await Promise.all(
        votes.map(async vote => {
          await deleteCacheResult(`memberUnits_${vote.recipient}_${chainId}`);
          await deleteCacheResult(`memberFlowRate${vote.recipient}_${chainId}`);
        }),
      );
      setTimeout(() => router.refresh(), 500);
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setStatus("guest");
      return;
    }
    if (votingPower === BigInt(0)) {
      setStatus("cant-vote");
      return;
    }
    if (votes.length > 0) {
      setStatus("voted");
      return;
    }
    setStatus("not-voted");
  }, [isAuthenticated, votingPower, votes]);

  const canVote = status === "voted" || status === "not-voted";

  const updateVote = (recipient: `0x${string}`, bps: number) => {
    setVotes([...votes.filter(v => v.recipient !== recipient), { recipient, bps }]);
  };

  const totalBps = votes.reduce((acc, v) => acc + v.bps, 0) || 0;
  const leftBps = PERCENTAGE_SCALE - totalBps;
  const votedCount = votes.filter(v => v.bps > 0).length || 0;

  const saveVotes = async () => {
    if (onchainStatus !== "idle") return;

    await write(client => {
      return client.simulateContract({
        account: user ?? undefined,
        address: contract,
        abi: revolutionGrantsAbi,
        chain: getChain(chainId),
        functionName: "setVotesAllocations",
        args: [votes.map(vote => vote.recipient), votes.map(vote => vote.bps)],
      });
    });
  };

  return {
    status,
    votes,
    canVote,
    updateVote,
    totalBps,
    leftBps,
    votedCount,
    saveVotes,
  };
}
