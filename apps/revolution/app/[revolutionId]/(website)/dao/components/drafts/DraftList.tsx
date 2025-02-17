"use client";

import { useIsDesktop } from "@cobuild/libs/hooks/useIsScreenSize";
import { Skeleton } from "@cobuild/ui/atoms/Skeleton";
import { SidebarListItem } from "../SidebarListItem";
import { DraftBadge } from "./DraftBadge";
import { useDrafts } from "./useDrafts";

type Props = {
  revolutionId: string;
  urlPrefix: string;
  phrase: string;
  sort: string;
  currentId: string;
  newestDraftId: string | null;
};

export const DraftList = (props: Props) => {
  const { revolutionId, urlPrefix, currentId, newestDraftId, phrase, sort } = props;
  const { drafts, isLoading } = useDrafts({ revolutionId, phrase, sort });

  const isDesktop = useIsDesktop();

  if (isLoading) {
    return <Skeleton count={8} height={96} rounded />;
  }

  if (!isLoading && drafts.length === 0) {
    return <div className="text-sm opacity-50">No drafts found...</div>;
  }

  return drafts.map(({ draftId, title, profile, address, updatedAt, isOnChain }) => {
    const isSelected =
      currentId === draftId || (!currentId && newestDraftId === draftId && isDesktop);
    return (
      <SidebarListItem
        key={draftId}
        url={`${urlPrefix}/drafts/${draftId}`}
        isSelected={isSelected}
        title={title}
        profile={profile}
        address={address}
        badges={<DraftBadge updatedAt={updatedAt} isOnChain={isOnChain} showText={isSelected} />}
      />
    );
  });
};
