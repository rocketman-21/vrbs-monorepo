"use client";

import { VRBS_GRANTS_PROXY } from "@cobuild/database/models/revolution/revolutions/addresses";
import { IGrant, IGrantVote, Serialized } from "@cobuild/database/types";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { isAdmin } from "@cobuild/libs/revolution/admin";
import { Button } from "@cobuild/ui/atoms/Button";
import { EmptyState } from "@cobuild/ui/atoms/EmptyState/EmptyState";
import { Scrollable } from "@cobuild/ui/atoms/Scrollable";
import { useRevolution } from "app/libs/useRevolution";
import { useState } from "react";
import { GrantsListItem } from "./GrantsListItem";
import { GrantsVotingBar } from "./GrantsVotingBar";
import { SubgrantCreationModal } from "./SubgrantCreationModal";
import { SubgrantsListCta } from "./SubgrantsListCta";
import { useGrantsVote } from "./useGrantsVote";

interface Props {
  grants: Serialized<IGrant, "members">[];
  votes: IGrantVote[];
  parentGrant: Serialized<IGrant>;
}

export function SubgrantsList(props: Props) {
  const { grants, votes, parentGrant } = props;
  const { canVote, status, updateVote, ...rest } = useGrantsVote(
    votes,
    parentGrant.contractAddress as `0x${string}`,
  );

  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const { revolutionId } = useRevolution();

  const [newGrantType, setNewGrantType] = useState<"subgrant" | "opportunity" | null>(null);

  const isTopLevelPool = parentGrant.parentGrantsContract === VRBS_GRANTS_PROXY;

  return (
    <>
      <section className="bg-secondary-50 relative rounded-2xl py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="flex flex-col md:items-center md:justify-between max-sm:space-y-6 md:flex-row">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Grants {isTopLevelPool && <>& Opportunities</>}
              </h2>
              <p className="mt-2.5 lg:mt-4 text-zinc-600 text-sm lg:text-lg">
                Decide which grants get funding. {isTopLevelPool && <>Propose new opportunities.</>}
              </p>
            </div>
            <SubgrantsListCta status={status} isEditing={isEditing} setIsEditing={setIsEditing} />
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
          {grants.length === 0 && (
            <EmptyState className="mt-8" text="There are no subgrants yet." />
          )}
        </div>
        <div className="mt-16 flex flex-col md:flex-row items-center md:justify-center max-sm:space-y-4 md:space-x-4">
          <Button
            size="md"
            color="outline"
            onClick={() => setNewGrantType("subgrant")}
            type="button"
          >
            Apply for funding
          </Button>
          {user && isAdmin(user, revolutionId) && isTopLevelPool && (
            <Button
              size="md"
              color="outline"
              type="button"
              onClick={() => setNewGrantType("opportunity")}
            >
              Create opportunity
            </Button>
          )}
        </div>
      </section>

      <SubgrantCreationModal
        parent={parentGrant}
        isOpen={newGrantType !== null}
        close={() => setNewGrantType(null)}
        type={newGrantType || "subgrant"}
      />

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
