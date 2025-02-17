"use client";

import { VRBS_GRANTS_PROXY } from "@cobuild/database/models/revolution/revolutions/addresses";
import { IGrant, IGrantVote, Serialized } from "@cobuild/database/types";
import { EmptyState } from "@cobuild/ui/atoms/EmptyState/EmptyState";
import { Scrollable } from "@cobuild/ui/atoms/Scrollable";
import { useRevolution } from "app/libs/useRevolution";
import { useEffect, useState } from "react";
import { GrantsListCta } from "./GrantsListCta";
import { GrantsListItem } from "./GrantsListItem";
import { GrantsVotingBar } from "./GrantsVotingBar";
import { useGrantsVote } from "./useGrantsVote";

interface Props {
  grants: Serialized<IGrant, "members">[];
  revolutionId: string;
  votes: IGrantVote[];
}

export function GrantsList(props: Props) {
  const { grants, votes } = props;
  const { canVote, status, updateVote, ...rest } = useGrantsVote(votes, VRBS_GRANTS_PROXY);

  const [isEditing, setIsEditing] = useState(status === "not-voted");
  const { name } = useRevolution();

  useEffect(() => {
    if (status === "not-voted") setIsEditing(true);
    if (!canVote) setIsEditing(false);
  }, [status, canVote]);

  return (
    <>
      <section className="bg-secondary-50 relative my-8 rounded-2xl py-16" id="vote">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="flex flex-col items-center justify-between max-sm:space-y-6 md:flex-row">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Vote for grants
              </h2>
              <p className="mt-2.5 text-sm text-zinc-600 lg:mt-4 lg:text-lg">
                Fund what you believe will have the most impact for {name}.
              </p>
            </div>
            <GrantsListCta status={status} isEditing={isEditing} setIsEditing={setIsEditing} />
          </div>
          <Scrollable horizontal>
            <table className="divide-lead-500 relative mt-8 min-w-full divide-y md:mt-12">
              <thead className="bg-secondary-50 sticky top-0">
                <tr>
                  <th colSpan={2} className="py-3.5 pr-1.5 text-left text-sm font-semibold sm:pr-3">
                    Initiative
                  </th>
                  <th className="px-1.5 py-3.5 text-sm font-semibold sm:px-3">Monthly Support</th>
                  <th className="px-1.5 py-3.5 text-sm font-semibold sm:px-3">Total Earned</th>
                  <th className="px-1.5 py-3.5 text-sm font-semibold sm:px-3">Community votes</th>
                  {canVote && (
                    <th className="py-3.5 pl-1.5 text-sm font-semibold sm:pl-3">Your vote</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/20">
                {grants.map(grant => (
                  <GrantsListItem
                    grant={grant}
                    isEditing={isEditing}
                    canVote={canVote}
                    updateVote={updateVote}
                    setIsEditing={setIsEditing}
                    votes={votes}
                    key={grant.alloProfileId}
                  />
                ))}
              </tbody>
            </table>
          </Scrollable>
          {grants.length === 0 && <EmptyState className="mt-8" text="There are no grants yet." />}
        </div>
      </section>
      <GrantsVotingBar
        {...rest}
        canVote={canVote}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        votes={votes}
      />
    </>
  );
}
