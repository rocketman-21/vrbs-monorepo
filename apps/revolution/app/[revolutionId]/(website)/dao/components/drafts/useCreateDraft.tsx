"use client";

import { IDraft } from "@cobuild/database/types";
import { localApi } from "@cobuild/libs/api/local";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { Button } from "@cobuild/ui/atoms/Button";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { ComponentProps, useState } from "react";

export function useCreateDraft(args: {
  onSuccess: (draftId: string) => void;
  revolutionId: string;
}) {
  const { revolutionId, onSuccess } = args;
  const [isCreating, setIsCreating] = useState(false);
  const { isAuthenticated, login } = useUser();

  const createDraft = async () => {
    if (!isAuthenticated) return login();

    try {
      setIsCreating(true);

      const response = await toast.promise(
        localApi().url(`/${revolutionId}/routes/drafts/`).post({ revolutionId }).json<IDraft>(),
        {
          loading: "Creating draft...",
          success: "Draft created.",
          error: "Couldn't create draft. Try again",
        },
      );

      if (response.draftId) {
        onSuccess(response.draftId);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  return { createDraft, isCreating };
}

export const CreateDraftButton = (
  props: Omit<ComponentProps<typeof Button>, "onClick" | "disabled"> & {
    onSuccess: (draftId: string) => void;
    revolutionId: string;
  },
) => {
  const { revolutionId, onSuccess, ...rest } = props;
  const { createDraft, isCreating } = useCreateDraft({ revolutionId, onSuccess });

  return <Button {...rest} onClick={createDraft} disabled={isCreating} />;
};
