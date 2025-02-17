"use client";

import { useIsDesktop } from "@cobuild/libs/hooks/useIsScreenSize";
import { Skeleton } from "@cobuild/ui/atoms/Skeleton";
import { ProposalListItem } from "./ProposalListItem";
import { useProposals } from "./useProposals";

type Props = {
  entityId: string;
  revolutionId: string;
  userVotes: Array<{ proposalId: string; optionId: number }>;
  newestProposalId: string | null;
  urlPrefix: string;
  phrase: string;
  sort: string;
  status: string;
  currentId: string | null;
};

export const ProposalList = (props: Props) => {
  const { revolutionId, userVotes, newestProposalId, currentId, urlPrefix, ...rest } = props;
  const { proposals, isLoading } = useProposals({ revolutionId, ...rest });

  const isDesktop = useIsDesktop();

  if (isLoading) {
    return <Skeleton count={8} height={96} rounded />;
  }

  if (!isLoading && proposals.length === 0) {
    return <div className="text-sm opacity-50">No proposals found...</div>;
  }

  return (
    <>
      {proposals.map(proposal => (
        <ProposalListItem
          userVote={userVotes.find(vote => vote.proposalId === proposal.proposalId)?.optionId}
          key={proposal.proposalId}
          proposal={proposal}
          urlPrefix={`${urlPrefix}/proposals`}
          isSelected={
            currentId === proposal.proposalId ||
            (!currentId && newestProposalId === proposal.proposalId && isDesktop)
          }
        />
      ))}
    </>
  );
};
