"use client";

import { GovernanceType, IProposal } from "@cobuild/database/types";
import { calculateCutoffsForVote } from "@cobuild/libs/governance/voting";
import { useUrlState } from "@cobuild/libs/hooks/useUrlState";
import { Votes } from "app/components/Votes";
import cx from "classnames";
import { VoteTickerSerie } from "./VoteTickerSerie";

interface Props {
  votesCount: IProposal["votesCount"];
  options: IProposal["options"];
  type: GovernanceType;
}

export const VoteTicker = ({ votesCount, options, type }: Props) => {
  const [option, setOption] = useUrlState("option");

  const optionFor = options.find(o => o.preset === "For");
  const optionAgainst = options.find(o => o.preset === "Against");

  if (!optionFor || !optionAgainst) return null;
  const cutoffs = calculateCutoffs(votesCount);

  return (
    <div className="max-md:px-2">
      <div className="flex items-center overflow-hidden">
        {options.map(({ color, preset, name }) => (
          <VoteTickerSerie
            key={`${name}_${preset}`}
            count={preset ? Number(cutoffs[preset]) : 0}
            isMuted={!!option && option !== name}
            color={color}
            onClick={() => setOption(option === name ? "" : name)}
          />
        ))}
      </div>
      <div className="flex justify-between">
        <button
          className={cx("flex flex-col dark:contrast-75", {
            "opacity-20": option && option !== optionFor.name,
          })}
          onClick={() => setOption(option === optionFor.name ? "" : optionFor.name)}
          style={{ color: optionFor.color }}
          type="button"
        >
          <VotingScore label={optionFor.name} score={votesCount.for} />
        </button>
        <button
          className={cx("flex flex-col items-end text-[#D22209] dark:contrast-75", {
            "opacity-20": option && option !== optionAgainst.name,
          })}
          onClick={() => setOption(option === optionAgainst.name ? "" : optionAgainst.name)}
          type="button"
        >
          <VotingScore label={optionAgainst.name} score={votesCount.against} />
        </button>
      </div>
    </div>
  );
};

const VotingScore = ({ label, score }: { label: string; score: string | number }) => (
  <>
    <span className="text-[24px] font-semibold">
      <Votes type="auto">{score}</Votes>
    </span>{" "}
    <span className="text-sm">{label}</span>
  </>
);

const calculateCutoffs = (votes: IProposal["votesCount"]) => {
  const NUM_TICKS = BigInt(40);

  const totalVotes: bigint = BigInt(votes.total);

  const cutoffs = {
    For: calculateCutoffsForVote(BigInt(votes.for), totalVotes, NUM_TICKS),
    Abstain: calculateCutoffsForVote(BigInt(votes.abstain), totalVotes, NUM_TICKS),
    Against: calculateCutoffsForVote(BigInt(votes.against), totalVotes, NUM_TICKS),
  };

  if (totalVotes >= NUM_TICKS) return cutoffs;

  if (parseInt(votes.abstain) > 0 && cutoffs["Abstain"] === 0) {
    cutoffs["Abstain"] += 1;
  } else if (parseInt(votes.against) > 0 && cutoffs["Against"] === 0) {
    cutoffs["Against"] += 1;
  } else {
    cutoffs["Abstain"] += 1;
  }

  return cutoffs;
};
