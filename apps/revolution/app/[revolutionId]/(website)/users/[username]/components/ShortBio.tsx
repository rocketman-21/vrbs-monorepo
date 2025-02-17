"use client";

import { getErrorMessage } from "@cobuild/libs/utils/error";
import { ContentEditable } from "@cobuild/ui/molecules/ContentEditable/ContentEditable";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useRevolution } from "app/libs/useRevolution";
import { useTransition } from "react";
import { updateBio } from "./updateBio";

interface Props {
  editable: boolean;
  bio: string | null;
}

export const ShortBio = (props: Props) => {
  const { editable, bio } = props;
  const [isPending, startTransition] = useTransition();
  const { revolutionId } = useRevolution();

  return (
    <ContentEditable
      onEdit={content => {
        const id = toast.loading("Updating...", { duration: 5000 });
        startTransition(async () => {
          try {
            const result = await updateBio(content, revolutionId);

            if (result.success) {
              toast.success("Bio updated!", { id });
            }

            if (result.error) {
              throw new Error(result.error);
            }
          } catch (e: any) {
            console.error(e);
            toast.error(getErrorMessage(e) || "Couldn't update bio. Try again", { id });
          }
        });
      }}
      editable={editable}
      placeholder={`Click here to write your short bio...`}
      className="mt-6 text-pretty text-base leading-loose text-zinc-900 dark:text-zinc-100"
      pulse={isPending}
      submitOnEnter
    >
      {bio || (editable ? "Click to add bio" : "")}
    </ContentEditable>
  );
};
