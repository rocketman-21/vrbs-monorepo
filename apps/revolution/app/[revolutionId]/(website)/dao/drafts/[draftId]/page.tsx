import "server-only";

import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { Drafts } from "@cobuild/database/models/social/Drafts";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { getUser } from "@cobuild/libs/user/server";
import { EmptyState } from "@cobuild/ui/atoms/EmptyState/EmptyState";
import Discussion from "app/components/Discussion/Discussion";
import { DiscussionSkeleton } from "app/components/Discussion/DiscussionSkeleton";
import clsx from "classnames";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProposalSection } from "../../components/ProposalSection";
import { DraftBody } from "../../components/drafts/DraftBody";
import { DraftMobileMenu, IDraftTab } from "../../components/drafts/DraftMobileMenu";
import { DraftPrivacy } from "../../components/drafts/DraftPrivacy";
import { DraftPublish } from "../../components/drafts/DraftPublish";
import { DraftTransactions } from "../../components/drafts/DraftTransactions";
import { getProposalThreshold } from "../../components/proposalThreshold";

interface Props {
  params: { revolutionId: string; draftId?: string | null; hideOnMobile?: boolean };
  searchParams?: {
    tab?: IDraftTab;
  };
}
export const maxDuration = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { revolutionId, draftId } = params;

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution) return {};

  if (!draftId) return { title: `${revolution.name} Drafts` };

  const draft = await Drafts().findById(draftId);
  if (!draft) return {};

  return {
    title: `${draft.title}`,
    description: `Read more about ${draft.profile?.username}'s draft proposal for ${revolution.name}`,
  };
}

export default async function DraftPage(props: Props) {
  const { draftId, revolutionId, hideOnMobile } = props.params;
  const { tab = "draft" } = props.searchParams || {};
  const { darkMode } = getRevolutionConfig(revolutionId);

  if (!draftId) {
    return (
      <div className="col-span-2 flex h-full items-center justify-center">
        <EmptyState text="There are not any proposal drafts yet. Maybe create one?" />
      </div>
    );
  }

  const [draft, revolution, user] = await Promise.all([
    Drafts().findById(draftId),
    Revolutions().getById(revolutionId),
    getUser(revolutionId),
  ]);

  if (!draft || !revolution || !revolution?.daoContract) notFound();

  if (draft.isPrivate) {
    const user = await getUser(revolutionId);
    if (!draft.canBeManagedBy(user)) notFound();
  }

  const { chainId, governanceType } = revolution;

  const supportsTransactions = true;

  return (
    <>
      <DraftMobileMenu
        returnUrl={`/${revolutionId}/dao/drafts/`}
        defaultTab={tab}
        isHidden={hideOnMobile}
      />

      <div
        className={clsx(
          "lg:h-body lg:hide-scrollbar max-lg:px-2 lg:col-span-2 lg:block lg:space-y-6 lg:overflow-y-auto lg:py-8",
          { "max-lg:hidden": hideOnMobile || tab === "manage" },
        )}
      >
        <div className={clsx({ "max-lg:hidden": tab !== "draft" })}>
          <DraftBody
            draftId={draftId}
            canEdit={draft.canBeEditedBy(user)}
            canManage={draft.canBeManagedBy(user)}
            theme={darkMode ? "dark" : "light"}
            revolutionId={revolutionId}
          />
        </div>

        <ProposalSection
          title="Discussion"
          id="discussion"
          className={clsx({
            "max-lg:hidden": tab !== "discussion",
          })}
        >
          <Suspense fallback={<DiscussionSkeleton />}>
            <Discussion scope={{ id: draftId, type: "draft" }} />
          </Suspense>
        </ProposalSection>
      </div>
      <div
        className={clsx("lg:h-body space-y-6 max-lg:px-2 lg:block lg:pt-8", {
          "max-lg:hidden": hideOnMobile || tab !== "manage",
        })}
      >
        {draft.canBeManagedBy(user) && !draft.isOnChain && (
          <DraftPrivacy draftId={draftId} revolutionId={revolutionId} />
        )}

        {supportsTransactions && (
          <DraftTransactions
            draft={draft}
            revolutionId={revolutionId}
            canManage={draft.canBeManagedBy(user) && !draft.isOnChain}
          />
        )}

        {draft.canBeManagedBy(user) && (
          <div className="bg-card rounded-2xl p-5">
            <DraftPublish
              draftId={draftId}
              trackerType={revolution.governanceTrackerType}
              governanceContract={revolution.daoContract}
              entityType={governanceType}
              proposalThreshold={await getProposalThreshold(revolutionId)}
              chainId={chainId}
              revolutionId={revolutionId}
            />
          </div>
        )}
      </div>
    </>
  );
}
