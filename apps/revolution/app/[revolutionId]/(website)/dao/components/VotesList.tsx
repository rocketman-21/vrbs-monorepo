import "server-only";

import { Scrollable } from "@cobuild/ui/atoms/Scrollable";
import { IProposal, IVote, Serialized } from "@cobuild/database/types";
import { VotesListItem } from "./VotesListItem";

interface Props {
  proposal: Serialized<IProposal, "quorum">;
  votes: IVote[];
  revolutionId: string;
}

export async function VotesList(props: Props) {
  const { proposal, votes, revolutionId } = props;

  if (votes.length < 1)
    return (
      <div>
        <span className="text-sm text-zinc-400 dark:text-zinc-500">
          {parseInt(proposal.totalVotes) === 0 ? "No votes have been cast yet." : "No votes found."}
        </span>
        {parseInt(proposal.totalVotes) === 0 && (
          <a href={"#discussion"} className="mt-2.5 flex items-center md:hidden">
            <div className="mt-2.5 w-full rounded-[40px] border border-zinc-300 py-3 text-center text-sm font-medium hover:border-zinc-400 dark:border-zinc-500 dark:hover:border-zinc-400">
              Start a discussion
            </div>
          </a>
        )}
      </div>
    );

  return (
    <Scrollable vertical className="space-y-5 pr-1">
      {votes.map(vote => (
        <VotesListItem
          key={vote.voter}
          vote={vote}
          proposal={proposal}
          revolutionId={revolutionId}
        />
      ))}
    </Scrollable>
  );
}
