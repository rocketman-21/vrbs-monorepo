import "server-only";

import { IProposal, Serialized } from "@cobuild/database/types";
import { formatPrice } from "@cobuild/libs/utils/numbers";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import Discussion from "app/components/Discussion/Discussion";
import { DiscussionSkeleton } from "app/components/Discussion/DiscussionSkeleton";
import { UserProfile } from "app/components/user-profile/UserProfile";
import clsx from "classnames";
import { Suspense } from "react";
import { ProposalContent } from "./ProposalContent";
import { IProposalTab } from "./ProposalMobileMenu";
import { ProposalSection } from "./ProposalSection";

interface Props {
  proposal: Serialized<IProposal>;
  tab?: IProposalTab;
  revolutionId: string;
}

export async function ProposalBody({ proposal, tab, revolutionId }: Props) {
  const { amount, unit } = proposal.budget;

  return (
    <div className="lg:space-y-6">
      <div
        className={clsx("bg-card rounded-2xl", {
          "max-lg:hidden": tab !== "proposal",
        })}
      >
        <div className="p-4 pb-3 lg:p-6 lg:pb-0">
          <h2 className="text-balance text-xl font-semibold lg:text-2xl">
            {proposal.numericId && (
              <span className="pr-2 text-zinc-400 dark:text-zinc-500">{proposal.numericId}</span>
            )}
            {proposal.title}
          </h2>

          <div className="mt-4 flex flex-col space-y-4">
            <div className="grid grid-cols-2 gap-4 lg:flex lg:items-center lg:justify-between">
              <div className="col-span-2 flex flex-col space-y-1">
                <span className="mb-1 text-zinc-400 max-sm:text-sm dark:text-zinc-500">By</span>
                <UserProfile address={proposal.proposer} revolutionId={revolutionId} withPopover>
                  {user => (
                    <div className="flex items-center space-x-1.5">
                      <Avatar id={proposal.proposer} imageUrl={user.profilePicture} />
                      <span className="font-medium">{user.displayUsername}</span>
                    </div>
                  )}
                </UserProfile>
              </div>
              <div className="flex space-x-6">
                <Tooltip subtitle={proposal.transactions}>
                  <div>
                    <span className="mb-1 text-zinc-400 max-sm:text-sm dark:text-zinc-500">Tx</span>
                    <div className="font-medium">{proposal.targets?.length}</div>
                  </div>
                </Tooltip>
                {!!amount && (
                  <div>
                    <span className="mb-1 text-zinc-400 max-sm:text-sm dark:text-zinc-500">
                      Budget
                    </span>
                    <div className="font-medium">{formatPrice(amount, unit as any)}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr className="my-3 border-zinc-200 lg:my-6 dark:border-zinc-700" />
        </div>

        <ProposalContent>
          {processProposalDescriptionText(proposal.description || "", proposal.title || "") +
            (proposal.transactions ? "\n\n### Transactions \n" : "") +
            proposal.transactions}
        </ProposalContent>
      </div>

      <ProposalSection
        title="Discussion"
        id="discussion"
        className={clsx({
          "max-lg:hidden": tab !== "discussion",
        })}
      >
        <Suspense fallback={<DiscussionSkeleton />}>
          <Discussion scope={{ id: proposal.uniqueId, type: "proposal" }} />
        </Suspense>
      </ProposalSection>
    </div>
  );
}

export const processProposalDescriptionText = (descriptionText: string, proposalTitle: string) => {
  descriptionText = descriptionText
    .replace(proposalTitle, "")
    .replace(/#{1,3} \n/gm, "")
    .replace("&&", "");

  // replace all instances of <p><br></p> with nothing
  descriptionText = descriptionText.replace(/<p><br><\/p>/gm, "");

  return descriptionText;
};
