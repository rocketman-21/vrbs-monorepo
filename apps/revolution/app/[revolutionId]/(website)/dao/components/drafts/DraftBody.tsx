"use client";

import { IDraft } from "@cobuild/database/types";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { AutosaveIndicator } from "@cobuild/ui/atoms/AutosaveIndicator";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { ContentEditable } from "@cobuild/ui/molecules/ContentEditable/ContentEditable";
import DeleteIcon from "@cobuild/ui/pixel-icons/Trash";
import { ProposalBodySkeleton } from "../ProposalBodySkeleton";
import { ProposalContent } from "../ProposalContent";
import DownloadButton from "./DownloadButton";
import { DraftTeam } from "./DraftTeam";
import { useDraft } from "./useDraft";
import { useDrafts } from "./useDrafts";

const MarkdownEditor = dynamic(
  () => import("@cobuild/ui/organisms/MarkdownEditor/MarkdownEditor"),
  {
    ssr: false,
  },
);

interface Props {
  draftId: string;
  theme: "light" | "dark";
  canEdit: boolean;
  canManage: boolean;
  revolutionId: string;
}

export function DraftBody(props: Props) {
  const { draftId, theme, canEdit, canManage, revolutionId } = props;

  const { updateDraft, isUpdating, deleteDraft, isDeleting, draft, mutate } = useDraft(
    draftId,
    revolutionId,
  );
  const { mutate: refreshDraftsList } = useDrafts({ revolutionId });
  const [hasChanges, setHasChanges] = useState(false);

  const draftUrl = usePathname();

  const saveDraft = async (args: Partial<IDraft>) => {
    if (!canManage) return;
    await updateDraft(args, false);
    setHasChanges(false);
  };

  const autosaveDraft = useDebouncedCallback(saveDraft, 1000);

  if (!draft) return <ProposalBodySkeleton />;

  return (
    <div className="bg-card rounded-2xl">
      <div className="p-4 pb-0 lg:p-6 lg:pb-0">
        <div className="flex items-center justify-between space-x-4">
          <ContentEditable
            as={"h2"}
            className="grow text-xl font-semibold lg:text-2xl"
            editable={canEdit}
            onInput={() => setHasChanges(true)}
            onEdit={title => {
              saveDraft({ title }).then(refreshDraftsList);
            }}
            maxLength={60}
            placeholder="Enter draft title..."
          >
            {draft.title}
          </ContentEditable>

          {canManage && (
            <div className="flex space-x-2">
              <DownloadButton content={draft.body} filename={draft.title} />
              {!draft.isOnChain && (
                <Tooltip subtitle="Delete Draft">
                  <button
                    className="flex items-center justify-center rounded-full bg-zinc-100 p-2 text-zinc-800 duration-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                    onClick={() => {
                      if (!confirm("Are you sure you want to delete this draft?")) return;
                      deleteDraft(() => {
                        window.location.assign(draftUrl.replace(draftId, ""));
                      });
                    }}
                    disabled={isDeleting}
                  >
                    <DeleteIcon className="h-4 w-4" />
                  </button>
                </Tooltip>
              )}
            </div>
          )}
        </div>

        <div className="mt-4">
          <div className="text-zinc-400 max-sm:text-sm dark:text-zinc-500">By</div>
          <div className="mt-2 flex flex-wrap [&>*]:mb-2.5 [&>*]:mr-6">
            <DraftTeam
              editable={canManage && !draft.isOnChain}
              onUpdate={team =>
                saveDraft({ team: team.filter(a => a !== draft.address) as `0x${string}`[] })
              }
              team={[draft.address, ...draft.team]}
              protect={draft.address}
            />
          </div>
        </div>

        <hr className="my-3 border-zinc-200 lg:my-6 dark:border-zinc-700" />
      </div>

      {!canEdit && <ProposalContent>{draft.body}</ProposalContent>}

      {canEdit && (
        <div className="min-h-[240px] pb-6">
          <MarkdownEditor
            theme={theme}
            initialContent={draft.body}
            onUpdate={body => {
              if (body === draft.body) return;
              setHasChanges(true);
              autosaveDraft({ draftId, body });
            }}
            onBlur={() => mutate()}
          />
        </div>
      )}

      {canEdit && <AutosaveIndicator isUpdating={isUpdating} hasChanges={hasChanges} />}
    </div>
  );
}
