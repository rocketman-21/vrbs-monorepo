"use client";

import SvgSpinner from "@cobuild/ui/icons/Spinner";
import { toast } from "@cobuild/ui/organisms/Notifications";
import UploadIcon from "@cobuild/ui/pixel-icons/Upload";
import { ImageInput, useImageUpload } from "app/libs/useImageUpload";
import clsx from "classnames";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateGrantImage } from "./updateGrantImage";

interface Props {
  alloProfileId: string;
  chainId: number;
  canManage: boolean;
  imageUrl: string;
}

export const GrantImage = (props: Props) => {
  const { canManage, alloProfileId, chainId } = props;
  const [imageUrl, setImageUrl] = useState(props.imageUrl || "");
  const { isUploading, upload } = useImageUpload(url => {
    setImageUrl(url);

    startTransition(async () => {
      const result = await updateGrantImage({ alloProfileId, chainId, imageUrl: url });

      if (result.grant) {
        toast.success("Grant image updated!");
        router.refresh();
      }

      if (result.error) {
        toast.error(result.error);
      }
    });
  });

  const [isSaving, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="size-12 shrink-0 overflow-hidden rounded-xl md:size-20">
      {!canManage && (
        <Image
          className="h-full w-full object-cover"
          src={imageUrl}
          alt="Grant"
          width={80}
          height={80}
        />
      )}
      {canManage && (
        <ImageInput
          className="group relative flex h-full w-full items-center justify-center"
          disabled={isUploading || isSaving}
          isUploading={isUploading}
          upload={upload}
        >
          <Image
            className={clsx(
              "h-full w-full object-cover duration-100 ease-in-out group-hover:opacity-25",
              { "opacity-25": isUploading },
            )}
            src={imageUrl}
            alt="Grant"
            width={80}
            height={80}
          />
          {isUploading && <SvgSpinner className="dutation-100 absolute size-6 animate-spin" />}
          {!isUploading && (
            <UploadIcon className="absolute size-6 text-black opacity-0 duration-100 ease-in-out group-hover:opacity-100" />
          )}
        </ImageInput>
      )}
    </div>
  );
};
