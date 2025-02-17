"use client";

import { Toggle } from "@cobuild/ui/atoms/Toggle";
import { toast } from "@cobuild/ui/organisms/Notifications";
import clsx from "classnames";
import { useDraft } from "./useDraft";

interface Props {
  draftId: string;
  revolutionId: string;
}

export const DraftPrivacy = (props: Props) => {
  const { draftId, revolutionId } = props;

  const { draft, updateDraft, isUpdating } = useDraft(draftId, revolutionId);

  if (!draft) return;

  return (
    <div className="bg-card rounded-2xl p-5">
      <h3 className="font-semibold">Draft Visibility</h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
        Decide who can see this draft.
      </p>
      <Toggle
        className={clsx("mt-4 text-sm", { "animate-pulse": isUpdating })}
        disabled={isUpdating}
        isChecked={!draft.isPrivate}
        onChange={async isChecked => {
          await updateDraft({ isPrivate: !isChecked });
          toast.success(`Draft is now ${isChecked ? "public" : "private"}`);
        }}
      >
        Publicly visible
      </Toggle>
    </div>
  );
};
