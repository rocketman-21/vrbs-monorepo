"use client";

import { Button } from "@cobuild/ui/atoms/Button";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { ImageInput, useImageUpload } from "app/libs/useImageUpload";
import { useRevolution } from "app/libs/useRevolution";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { addImpact } from "./addImpact";

export const UploadImpact = () => {
  const { revolutionId } = useRevolution();
  const router = useRouter();
  const [isSaving, startTransition] = useTransition();

  const { isUploading, upload } = useImageUpload((imageUrl, thumbnailUrl) => {
    startTransition(async () => {
      const result = await addImpact({ imageUrl, thumbnailUrl, revolutionId });

      if (result.item) {
        toast.success("Image added!");
        router.refresh();
      }

      if (result.error) {
        toast.error(result.error);
      }
    });
  });

  const isBusy = isUploading || isSaving;

  return (
    <Button disabled={isBusy} pulse={isBusy}>
      <ImageInput disabled={isBusy} isUploading={isUploading} upload={upload} acceptGif>
        + Upload image
      </ImageInput>
    </Button>
  );
};
