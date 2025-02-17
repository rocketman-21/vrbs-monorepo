"use client";

import { IProposal, IVote, Serialized } from "@cobuild/database/types";
import { shortenIfEthAddress } from "@cobuild/libs/utils/account";
import { formatVotes } from "app/components/Votes";
import { useRevolution } from "app/libs/useRevolution";
import Linkify from "linkify-react";
import { getVoteImageUrl } from "./VoteImage";

interface Props {
  proposal: Serialized<IProposal, "quorum">;
  vote: IVote;
}

export function VotesListItemReason(props: Props) {
  const { vote, proposal } = props;

  const { revolutionId, governanceType } = useRevolution();
  const option = proposal.options.find(({ optionId }) => optionId === vote.optionId);

  return (
    <button
      onClick={() => {
        const voteImageUrl = getVoteImageUrl({
          revolutionId,
          profilePicture: vote.profile?.profilePicture || undefined,
          username: shortenIfEthAddress(vote.profile?.username || vote.voter),
          reason: vote.reason,
          name: option?.name.toLowerCase() || "",
          numVotes: formatVotes(vote.weight, governanceType),
          proposalId: proposal.proposalId,
          proposalTitle: proposal.title || undefined,
        });
        window.open(voteImageUrl, "_blank");
      }}
      className="inline-flex text-left"
    >
      <div className="mt-2 whitespace-pre-line break-words pr-1.5 text-sm dark:text-zinc-300">
        <Linkify
          options={{
            className: "underline text-lead-500 break-all hover:opacity-75 duration-150",
            target: "_blank",
            attributes: { onClick: (e: MouseEvent) => e.stopPropagation() },
          }}
        >
          {vote.reason}
        </Linkify>
      </div>
    </button>
  );
}
