"use client";

import { IContest } from "@cobuild/database/models/revolution/contests/IContest";
import { getGovernanceTokenQuote } from "@cobuild/libs/web3/auction/governance-token";
import { Ether } from "@cobuild/ui/atoms/Ether";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { Votes } from "app/components/Votes";
import { VotingPowerIcon } from "app/components/VotingPowerIcon";
import { useRevolution } from "app/libs/useRevolution";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  rank: number;
  contest: IContest;
}

export const CreationContestReward = (props: Props) => {
  const { rank, contest } = props;
  const { addresses, chainId } = useRevolution();
  const [ethReward, setEthReward] = useState<bigint | null>(null);
  const [votesReward, setVotesReward] = useState<string | null>(null);

  const payoutSplitIndex = rank - 1;

  useEffect(() => {
    if (!contest.payoutSplits || payoutSplitIndex >= contest.payoutSplits.length || !addresses)
      return;

    if (!addresses.pointsEmitter) {
      return;
    }

    const payoutSplit = contest.payoutSplits[payoutSplitIndex] / 1e6;
    const totalReward = Number(contest.balance) * payoutSplit;
    const directReward = (totalReward * Number(contest.entropyRate)) / 1e6;

    setEthReward(BigInt(directReward));
    getGovernanceTokenQuote(addresses.pointsEmitter, chainId, totalReward - directReward).then(
      setVotesReward,
    );
  }, [
    addresses,
    chainId,
    contest.balance,
    contest.entropyRate,
    contest.payoutSplits,
    payoutSplitIndex,
  ]);

  if (!ethReward || !votesReward) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 * rank }}
      className="bg-goal absolute right-2 top-2 flex rounded-md px-2 py-[5px] text-white"
    >
      <Tooltip title={`#${rank} Rewards`} subtitle="ETH and voting power for creator">
        <div className="flex items-center text-xs">
          <Ether amount={ethReward} symbol="Ξ" />
          <VotingPowerIcon className="ml-2.5 mr-1.5 size-3" /> <Votes>{votesReward}</Votes>
        </div>
      </Tooltip>
    </motion.div>
  );
};
