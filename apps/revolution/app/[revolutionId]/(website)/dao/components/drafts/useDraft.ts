"use client";

import { IDraft, Serialized } from "@cobuild/database/types";
import { localApi } from "@cobuild/libs/api/local";
import { useLocalApi } from "@cobuild/libs/api/useLocalApi";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useState } from "react";

export function useDraft(draftId: string, revolutionId?: string) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const apiUrl = `/${revolutionId}/routes/drafts/${draftId}`;

  const { data: draft, isLoading, mutate } = useLocalApi<Serialized<IDraft>>(apiUrl);

  const updateDraft = async (values: Partial<IDraft>, mutateAfter = true) => {
    setIsUpdating(true);

    try {
      const updatedDraft = await localApi().url(apiUrl).put(values).json<Serialized<IDraft>>();
      if (!updatedDraft || updatedDraft.draftId !== draftId) throw new Error();
      if (mutateAfter) await mutate(updatedDraft, { revalidate: false });
    } catch (e: any) {
      console.error(e);
      toast.error("Couldn't update draft. Try again");
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteDraft = async (onSuccess: () => void) => {
    setIsDeleting(true);

    try {
      await localApi().url(apiUrl).delete().json();

      toast.success("Draft deleted", { position: "bottom-center" });
      onSuccess();
    } catch (e: any) {
      console.error(e);
      toast.error("Couldn't delete draft. Try again");
    } finally {
      setIsDeleting(false);
    }
  };

  return { updateDraft, isUpdating, deleteDraft, isDeleting, draft, isLoading, mutate };
}
