"use client";

import { ContentEditable } from "@cobuild/ui/molecules/ContentEditable/ContentEditable";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useRevolution } from "app/libs/useRevolution";
import { useMemo, useTransition } from "react";
import { updateSplit } from "./updateSplit";

interface Props {
  split: `0x${string}`;
  name: string | null;
  canEdit: boolean;
}

export const SplitName = (props: Props) => {
  const { canEdit, split } = props;
  const [isPending, startTransition] = useTransition();
  const { revolutionId } = useRevolution();

  const name = useMemo(() => {
    if (!canEdit) return props.name || "Untitled Split";
    if (props.name === "Untitled Split") return undefined;
    return props.name || undefined;
  }, [props.name, canEdit, split]);

  return (
    <ContentEditable
      as="h3"
      onEdit={text => {
        startTransition(async () => {
          const { error, isSuccess } = await updateSplit(revolutionId, split, { name: text });
          if (isSuccess) toast.success("Split name updated");
          if (error) toast.error(error);
        });
      }}
      editable={canEdit}
      className="font-medium"
      placeholder="Add a name..."
      maxLength={32}
      submitOnEnter
      pulse={isPending}
    >
      {name}
    </ContentEditable>
  );
};
