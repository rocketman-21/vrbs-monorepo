"use client";

import { CultureIndexVersion } from "@cobuild/database/types";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { Votes } from "app/components/Votes";
import { VotingPowerIcon } from "app/components/VotingPowerIcon";
import clsx from "classnames";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { UpvoteIcon } from "./UpvoteIcon";
import { useOnchainUpvote } from "./useOnchainUpvote";

type Props = {
  pieceId: string;
  chainId: number;
  contractAddress: `0x${string}`;
  logicContractVersion: CultureIndexVersion;
  votesWeight: number;
  revolutionId: string;
};

export const OnchainUpvoteButton = (props: Props) => {
  const { revolutionId, pieceId, chainId, contractAddress, logicContractVersion } = props;

  const ref = useRef(null);
  const isInView = useInView(ref);

  const { hasVoted, vote, isLoading, isDropped, voteWeight, canVote, reason, votingPower } =
    useOnchainUpvote({
      enabled: isInView,
      pieceId,
      chainId,
      contractAddress,
      logicContractVersion,
      initialVotesWeight: props.votesWeight,
    });

  return (
    <Tooltip
      subtitle={
        reason || (
          <span className="flex items-center">
            Vote with <VotingPowerIcon className="ml-2 mr-1 h-3.5" /> <Votes>{votingPower}</Votes>
          </span>
        )
      }
    >
      <button
        ref={ref}
        onClick={vote}
        disabled={isLoading || !canVote}
        className={clsx("group/upvote flex w-full flex-col items-center", {
          "cursor-wait": isLoading,
        })}
      >
        <UpvoteIcon hasBeenDropped={isDropped} hasUpvoted={hasVoted} revolutionId={revolutionId} />

        <span
          className={clsx("mt-1 text-[11px] font-medium md:text-xs", {
            "animate-pulse": isLoading,
          })}
        >
          <Votes>{voteWeight}</Votes>
        </span>
      </button>
    </Tooltip>
  );
};
