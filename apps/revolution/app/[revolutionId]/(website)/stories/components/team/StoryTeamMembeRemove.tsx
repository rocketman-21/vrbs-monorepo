"use client";

import { IProfile } from "@cobuild/database/types";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { toast } from "@cobuild/ui/organisms/Notifications";
import TrashIcon from "@cobuild/ui/pixel-icons/Trash";
import { useRevolution } from "app/libs/useRevolution";
import { useRouter } from "next/navigation";
import { removeTeamMember } from "./removeTeamMember";

interface Props {
  profile: IProfile;
  removeable: boolean;
  isContributor: boolean;
  slug: string;
}

export const StoryTeamMemberRemove = (props: Props) => {
  const { profile, removeable, slug, isContributor } = props;
  const { address, profilePicture } = profile;

  const { revolutionId } = useRevolution();
  const router = useRouter();

  return (
    <div className="group relative size-6">
      <Avatar id={address} imageUrl={profilePicture} size={24} />
      {removeable && (
        <button
          type="button"
          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/75 text-white opacity-0 duration-150 group-hover:opacity-100"
          onClick={async e => {
            e.preventDefault();
            if (!confirm("Are you sure you want to remove this team member?")) return;

            try {
              const result = await removeTeamMember(slug, revolutionId, address, isContributor);

              if (result.story) {
                toast.success("User removed!");
                router.refresh();
              }

              if (result.error) {
                throw new Error(result.error);
              }
            } catch (error) {
              toast.error(getErrorMessage(error));
            }
          }}
        >
          <TrashIcon className="size-4" />
        </button>
      )}
    </div>
  );
};
