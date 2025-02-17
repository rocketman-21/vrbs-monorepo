"use client";

import { GovernanceType, IDraft, TrackerType } from "@cobuild/database/types";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useRouter } from "next/navigation";
import { DraftPublishNouns } from "./DraftPublishNouns";
import { DraftPublishNounsBuilder } from "./DraftPublishNounsBuilder";
import { DraftPublishRevolution } from "./DraftPublishRevolution";
import { useDraft } from "./useDraft";
import { useDrafts } from "./useDrafts";

interface Props {
  draftId: string;
  revolutionId: string;
  chainId: number;
  proposalThreshold: string;
  trackerType: TrackerType;
  entityType: GovernanceType;
  governanceContract: `0x${string}`;
}

export const DraftPublish = (props: Props) => {
  const {
    draftId,
    revolutionId,
    chainId,
    proposalThreshold,
    governanceContract,
    entityType,
    trackerType,
  } = props;

  const router = useRouter();
  const { mutate: refreshDraftsList } = useDrafts({ revolutionId });
  const { draft, updateDraft } = useDraft(draftId, revolutionId);

  if (!draft) return;

  const publishDraft = async (data?: Partial<IDraft> & { toastId: string }) => {
    await updateDraft({ isOnChain: true, ...data });
    toast.success(`Proposal published!`, { id: data?.toastId });
    if (data?.proposalId) {
      router.push(`/${revolutionId}/dao/proposals/${data.proposalId}`);
    } else {
      router.push(`/${revolutionId}/dao/proposals/`);
    }
    refreshDraftsList();
  };

  switch (entityType) {
    case "nouns":
      return (
        <DraftPublishNouns
          draft={draft}
          chainId={chainId}
          governanceContract={governanceContract}
          trackerType={trackerType}
          proposalThreshold={proposalThreshold}
          revolutionId={revolutionId}
          onPublish={publishDraft}
        />
      );
    case "revolution":
      return (
        <DraftPublishRevolution
          draft={draft}
          chainId={chainId}
          governanceContract={governanceContract}
          trackerType={trackerType}
          proposalThreshold={proposalThreshold}
          revolutionId={revolutionId}
          onPublish={publishDraft}
        />
      );
    case "nounsbuilder":
      return (
        <DraftPublishNounsBuilder
          draft={draft}
          chainId={chainId}
          trackerType={trackerType}
          governanceContract={governanceContract}
          proposalThreshold={proposalThreshold}
          revolutionId={revolutionId}
          onPublish={publishDraft}
        />
      );
    default:
      throw new Error(`Draft Publish not supported for ${entityType}`);
  }
};
