"use client";

import { ScrollShadow } from "@cobuild/ui/atoms/ScrollShadow/ScrollShadow";
import clsx from "classnames";
import { useState } from "react";
import { ProposalList } from "./ProposalList";
import { ProposalSearchInput } from "./ProposalSearchInput";
import { ProposalsFilter } from "./ProposalsFilter";
import { ProposalsSorter } from "./ProposalsSorter";
import { Navigation, useNavigation } from "./common/Navigation";
import { DraftList } from "./drafts/DraftList";
import { DraftSidebarCreate } from "./drafts/DraftSidebarCreate";
import { CreateIdeaForm } from "./ideas/CreateIdeaForm";

type Props = {
  revolutionId: string;
  governanceEntityId: string;
  userVotes: Array<{ proposalId: string; optionId: number }>;
  newestProposalId: string | null;
  newestDraftId: string | null;
  urlPrefix: string;
  className?: string;
};

export const Sidebar = (props: Props) => {
  const { className, revolutionId, urlPrefix, governanceEntityId } = props;

  const [phrase, setPhrase] = useState("");
  const [sort, setSort] = useState("Newest");
  const [status, setStatus] = useState("");

  const { currentId, type } = useNavigation(revolutionId);

  return (
    <div
      className={clsx("lg:h-body flex flex-col max-lg:p-2 lg:pt-2", className, {
        "max-lg:hidden": !!currentId && type !== "ideas",
      })}
    >
      <Navigation revolutionId={revolutionId} urlPrefix={props.urlPrefix} />

      {type === "ideas" && (
        <div className={clsx("mt-4", { "max-lg:hidden": !!currentId })}>
          <CreateIdeaForm revolutionId={revolutionId || ""} />
        </div>
      )}

      {type !== "ideas" && (
        <div className="my-4 flex items-center justify-between space-x-2.5 max-lg:p-2">
          <ProposalSearchInput phrase={phrase} onChange={setPhrase} />
          <div className="flex h-[26px] shrink-0 items-center space-x-2">
            {type === "proposals" && (
              <>
                <ProposalsSorter sort={sort} onChange={setSort} />
                <ProposalsFilter status={status} onChange={setStatus} />
              </>
            )}
            {type === "drafts" && <DraftSidebarCreate revolutionId={revolutionId} />}
          </div>
        </div>
      )}

      {type !== "ideas" && (
        <ScrollShadow className="space-y-2">
          {type === "proposals" && (
            <ProposalList
              revolutionId={revolutionId}
              entityId={governanceEntityId}
              currentId={currentId}
              phrase={phrase}
              sort={sort}
              status={status}
              userVotes={props.userVotes}
              newestProposalId={props.newestProposalId}
              urlPrefix={urlPrefix}
            />
          )}
          {type === "drafts" && (
            <DraftList
              revolutionId={revolutionId}
              currentId={currentId}
              phrase={phrase}
              sort={sort}
              urlPrefix={urlPrefix}
              newestDraftId={props.newestDraftId}
            />
          )}
        </ScrollShadow>
      )}
    </div>
  );
};
