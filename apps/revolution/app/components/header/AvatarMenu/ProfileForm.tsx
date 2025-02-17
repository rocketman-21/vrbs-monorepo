"use client";

import { IProfile } from "@cobuild/database/types";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { Button } from "@cobuild/ui/atoms/Button";
import TextArea from "@cobuild/ui/atoms/TextArea";
import { TextInput } from "@cobuild/ui/atoms/TextInput/TextInput";
import SvgSpinner from "@cobuild/ui/icons/Spinner";
import { toast } from "@cobuild/ui/organisms/Notifications";
import UploadIcon from "@cobuild/ui/pixel-icons/Upload";
import { ImageInput, useImageUpload } from "app/libs/useImageUpload";
import { useRevolution } from "app/libs/useRevolution";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveProfile } from "./saveProfile";

interface Props {
  profile: IProfile;
  finishEditing: () => void;
}

export const ProfileForm = (props: Props) => {
  const { finishEditing, profile } = props;
  const { revolutionId } = useRevolution();
  const [profilePicture, setProfilePicture] = useState(profile.profilePicture || "");
  const { isUploading, upload } = useImageUpload(url => setProfilePicture(url));
  const [isSaving, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      className="flex w-full items-start space-x-3 p-5"
      onSubmit={e => {
        e.preventDefault();
        const id = toast.loading(`Saving...`, { duration: 20000 });
        const form = e.target as HTMLFormElement;
        startTransition(async () => {
          const formdata = new FormData(form);

          const { error } = await saveProfile({
            username: formdata.get("username")?.toString() || "",
            bio: formdata.get("bio")?.toString() || "",
            website: formdata.get("website")?.toString() || "",
            profilePicture,
            revolutionId,
          });

          if (error) {
            toast.error(error, { id, duration: 3000 });
            return;
          }

          toast.success("Profile updated!", { id, duration: 3000 });
          router.refresh();
          finishEditing();
        });
      }}
    >
      <ImageInput
        disabled={isUploading || isSaving}
        isUploading={isUploading}
        upload={upload}
        maxFileSize={500 * 1024}
      >
        <span className="group relative flex items-center justify-center">
          <Avatar id={profile.address} imageUrl={profilePicture} size="44" />
          {!isUploading && (
            <UploadIcon className="absolute size-6 text-white duration-100 group-hover:opacity-60" />
          )}
          {isUploading && <SvgSpinner className="dutation-100 absolute size-6 animate-spin" />}
        </span>
      </ImageInput>
      <div className="grow space-y-2">
        <TextInput
          name="username"
          autoComplete="off"
          minLength={3}
          maxLength={20}
          disabled={isSaving}
          placeholder="Vrbie..."
          defaultValue={profile.username}
          label="Username"
        />
        <TextArea
          label="Short bio"
          name="bio"
          autoComplete="off"
          maxLength={120}
          disabled={isSaving}
          placeholder="About you..."
          autosize
          maxHeight={116}
          defaultValue={profile.bio || ""}
        />
        <TextInput
          name="website"
          autoComplete="off"
          disabled={isSaving}
          placeholder="https://..."
          label="Website"
          defaultValue={profile.website || ""}
        />
        <div className="flex items-center justify-end space-x-1.5">
          <Button
            type="button"
            onClick={() => {
              finishEditing();
              setProfilePicture(profile.profilePicture || "");
            }}
            disabled={isSaving}
            color="transparent"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};
