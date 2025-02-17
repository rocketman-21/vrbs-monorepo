"use client";

import { getGifThumbnail } from "@cobuild/libs/media/gif-thumbnail";
import { PinataStorage } from "@cobuild/libs/storage/Pinata";
import { FileInput } from "@cobuild/ui/atoms/FileInput";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { PropsWithChildren, useState } from "react";

export const useImageUpload = (
  onSuccess: (imageUrl: string, thumbnailUrl: string, file: File) => void,
) => {
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (file: File) => {
    try {
      setIsUploading(true);
      const { url } = await PinataStorage.upload(file);
      if (!url) throw new Error();

      const gifThumbnail = await getGifThumbnail(file);
      const thumbnailUrl = gifThumbnail ? (await PinataStorage.upload(gifThumbnail)).url : url;

      onSuccess(url, thumbnailUrl, file);
    } catch (e: any) {
      toast.error(e?.message || "Failed to update image");
    } finally {
      setIsUploading(false);
    }
  };

  return { ImageInput, isUploading, upload };
};

export const ImageInput = (
  props: PropsWithChildren<{
    disabled?: boolean;
    isUploading: boolean;
    upload: (file: File) => Promise<void>;
    name?: string;
    className?: string;
    maxFileSize?: number;
    acceptGif?: boolean;
  }>,
) => {
  const { disabled, isUploading, upload, acceptGif, maxFileSize, ...rest } = props;

  const accept = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
  if (acceptGif) {
    accept.push("image/gif");
  }

  return (
    <FileInput
      accept={accept.join(", ")}
      disabled={isUploading || disabled}
      onChange={files => {
        if (files.length === 1 && files[0].type.startsWith("image")) {
          upload(files[0]);
        }
      }}
      maxFileSize={maxFileSize || 1 * 1024 * 1024}
      {...rest}
    />
  );
};
