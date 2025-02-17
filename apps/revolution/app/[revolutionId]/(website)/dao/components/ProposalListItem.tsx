"use client";

import { IProposal, Serialized } from "@cobuild/database/types";
import { SidebarListItem } from "./SidebarListItem";
import { StatusBadge } from "./StatusBadge";
import { UserOptionBadge } from "./UserOptionBadge";

type Props = {
  proposal: Serialized<IProposal>;
  urlPrefix: string;
  userVote?: number;
  isSelected?: boolean;
};

export const ProposalListItem = (props: Props) => {
  const { proposal, urlPrefix, userVote, isSelected } = props;

  const userOption = userVote ? proposal.options.find(o => userVote === o.optionId) : undefined;

  return (
    <SidebarListItem
      title={proposal.title || "Proposal"}
      address={proposal.proposer}
      profile={proposal.profile}
      url={`${urlPrefix}/${proposal.proposalId}`}
      isSelected={isSelected}
      numericId={proposal.numericId || undefined}
      badges={
        <>
          <StatusBadge status={proposal.status} showStatusText={isSelected} />
          {userOption && <UserOptionBadge option={userOption} showVoteText={isSelected} />}
        </>
      }
    />
  );
};
