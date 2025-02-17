"use client";

import { useUrlState } from "@cobuild/libs/hooks/useUrlState";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { Button } from "@cobuild/ui/atoms/Button";
import { IOption, Select } from "@cobuild/ui/atoms/Select";
import TextArea from "@cobuild/ui/atoms/TextArea";
import { TextInput } from "@cobuild/ui/atoms/TextInput/TextInput";
import { StaticModal } from "@cobuild/ui/molecules/StaticModal/StaticModal";
import { toast } from "@cobuild/ui/organisms/Notifications";
import UploadIcon from "@cobuild/ui/pixel-icons/Upload";
import { ImageInput, useImageUpload } from "app/libs/useImageUpload";
import { useRevolution } from "app/libs/useRevolution";
import clsx from "classnames";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createStory } from "./createStory";

interface Props {
  user: `0x${string}` | null;
  initiatives: IOption[];
}

const formId = `create-story-form`;

export const CreateStoryModal = (props: Props) => {
  const { user, initiatives } = props;
  const { revolutionId, name } = useRevolution();
  const [isOpen, setIsOpen] = useUrlState("createStory");
  const [imageUrl, setImageUrl] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { isUploading, upload } = useImageUpload(url => setImageUrl(url));
  const disabled = !user;

  const closeModal = () => setIsOpen("");

  const handleFormSubmission = (formData: FormData) => {
    startTransition(async () => {
      try {
        if (!user) throw new Error("Please connect your wallet");

        const { story, error } = await createStory(
          {
            title: formData.get("title") as string,
            thumbnailUrl: imageUrl,
            description: formData.get("description") as string,
            externalUrl: formData.get("externalUrl") as string,
            alloProfileId: formData.get("alloProfileId") as string,
          },
          revolutionId,
        );

        if (!story || error) {
          throw new Error(error || "Couldn't create story. Try again");
        }

        setImageUrl("");
        closeModal();
        toast.success("Story created");
        router.refresh();
      } catch (e: any) {
        console.error(e);
        toast.error(getErrorMessage(e) || "Couldn't create story. Try again");
      }
    });
  };

  return (
    <StaticModal
      isOpen={isOpen === "true"}
      closeModal={closeModal}
      title="Add a story"
      width="600px"
      showCloseButton
      actions={
        <Button size="md" disabled={isPending} type="submit" form={formId}>
          {isPending ? "Please wait... " : "Add story"}
        </Button>
      }
    >
      <div className="flex w-full flex-col">
        <h1 className="mb-1 text-xl font-semibold max-sm:hidden dark:text-white">Add a story</h1>
        <h3 className="text-zinc-500 md:pr-8">Write about something new in the community.</h3>

        {!user && (
          <div className="my-6 flex items-center text-sm text-red-600">
            Please sign in first in order to fill the form.
          </div>
        )}

        <form className="mt-6 space-y-4" id={formId} action={handleFormSubmission}>
          <div className="self-end">
            <ImageInput
              disabled={disabled || isUploading}
              isUploading={isUploading}
              upload={upload}
              acceptGif
            >
              <input type="hidden" name="imageUrl" value={imageUrl} />
              <div className="group/thumbnail-btn flex items-center space-x-4">
                {!imageUrl && (
                  <div className="border-lead-400 flex aspect-[3/2] w-24 shrink-0 items-center justify-center rounded-lg border border-dashed">
                    <UploadIcon className="text-lead-500 size-5" />
                  </div>
                )}
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    width={192}
                    height={128}
                    className="aspect-[3/2] w-24 rounded-lg object-cover"
                    alt="Story"
                  />
                )}
                <div>
                  <div
                    className={clsx("text-zinc-900 duration-150", {
                      "animate-pulse": isUploading,
                      "lg:group-hover/thumbnail-btn:text-lead-500": !disabled,
                    })}
                  >
                    {!imageUrl ? "Upload" : "Change"} thumbnail
                  </div>
                  <div className="text-sm text-zinc-500">Please use the horizontal image</div>
                </div>
              </div>
            </ImageInput>
          </div>

          <Select
            name="alloProfileId"
            label="Grant (optional)"
            disabled={disabled}
            options={initiatives}
          />

          <TextInput
            name="title"
            label="Title"
            placeholder="New story..."
            required
            type="text"
            autoComplete="off"
            disabled={disabled}
          />

          <TextArea
            name="description"
            label="Content"
            placeholder={`What's new is happening in ${name}?`}
            required
            autosize
            rows={5}
            disabled={disabled}
          />

          <TextInput
            name="externalUrl"
            label="URL with more information"
            placeholder="http://"
            type="text"
            autoComplete="off"
            disabled={disabled}
          />
        </form>
      </div>
    </StaticModal>
  );
};
