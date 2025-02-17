"use client";

import { IStory, Serialized } from "@cobuild/database/types";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { Button } from "@cobuild/ui/atoms/Button";
import { IOption, Select } from "@cobuild/ui/atoms/Select";
import TextArea from "@cobuild/ui/atoms/TextArea";
import { TextInput } from "@cobuild/ui/atoms/TextInput/TextInput";
import { StaticModal } from "@cobuild/ui/molecules/StaticModal/StaticModal";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useRevolution } from "app/libs/useRevolution";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateStory } from "./updateStory";

interface Props {
  story: Serialized<IStory>;
  initiatives: IOption[];
  isOpen: boolean;
  closeModal: () => void;
}

const formId = `edit-story-form`;

export const EditStoryModal = (props: Props) => {
  const { initiatives, isOpen, closeModal, story } = props;
  const { revolutionId, name } = useRevolution();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [alloProfileId, setAlloProfileId] = useState(story.alloProfileId);

  const handleFormSubmission = (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await updateStory(story.slug, revolutionId, {
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          externalUrl: formData.get("externalUrl") as string,
          alloProfileId,
        });

        if (result.story) {
          closeModal();
          toast.success("Impact updated!");
          router.refresh();
        }

        if (result.error) {
          throw new Error(result.error);
        }
      } catch (e: any) {
        console.error(e);
        toast.error(getErrorMessage(e) || "Couldn't update impact. Try again");
      }
    });
  };

  return (
    <StaticModal
      isOpen={isOpen}
      closeModal={closeModal}
      title="Edit impact"
      width="680px"
      showCloseButton
      actions={
        <Button size="md" disabled={isPending} type="submit" form={formId}>
          {isPending ? "Please wait... " : "Save changes"}
        </Button>
      }
    >
      <div className="flex w-full flex-col">
        <h1 className="mb-1 text-xl font-semibold max-sm:hidden dark:text-white">Edit impact</h1>

        <form className="mt-6 space-y-4" id={formId} action={handleFormSubmission}>
          <Select
            name="alloProfileId"
            label="Grant (optional)"
            options={initiatives}
            value={story.alloProfileId || undefined}
            onChange={option => setAlloProfileId((option as IOption | undefined)?.value || "")}
          />

          <TextInput
            name="title"
            label="Title"
            placeholder="What you did?"
            required
            type="text"
            autoComplete="off"
            defaultValue={story.title}
          />

          <TextArea
            name="description"
            label="Content"
            placeholder={`Tell us more about your impact`}
            required
            autosize
            rows={8}
          >
            {story.description}
          </TextArea>

          <TextInput
            name="externalUrl"
            label="URL with more information"
            placeholder="http://"
            type="text"
            autoComplete="off"
            defaultValue={story.externalUrl || ""}
          />
        </form>
      </div>
    </StaticModal>
  );
};
