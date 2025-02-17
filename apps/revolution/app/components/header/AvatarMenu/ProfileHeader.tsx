"use client";

import { useUser } from "@cobuild/libs/hooks/useUser";
import { shortenIfEthAddress } from "@cobuild/libs/utils/account";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import SvgEdit from "@cobuild/ui/pixel-icons/Edit";
import { MobileConditionalTooltip } from "app/components/MobileConditionalTooltip";
import { useRevolution } from "app/libs/useRevolution";
import { ProfileForm } from "./ProfileForm";
import Link from "next/link";
import { useState } from "react";

interface Props {
  user: `0x${string}`;
  close: () => void;
}

export const ProfileHeader = (props: Props) => {
  const { user, close } = props;
  const [isEditing, setIsEditing] = useState(false);
  const { profile } = useUser();
  const { revolutionId } = useRevolution();

  if (!profile) return null;

  if (isEditing) {
    return <ProfileForm profile={profile} finishEditing={() => setIsEditing(false)} />;
  }

  return (
    <div className="flex items-center justify-between space-x-2.5 p-5">
      <div className="flex items-center space-x-3 overflow-hidden">
        <Link onClick={close} href={`/${revolutionId}/users/${profile.username}`}>
          <Avatar id={user} imageUrl={profile.profilePicture} size="44" />
        </Link>
        <dl>
          <dt onClick={close} className="font-medium">
            <Link
              href={`/${revolutionId}/users/${profile.username}`}
              className="duration-100 hover:opacity-75"
            >
              {shortenIfEthAddress(profile.username)}
            </Link>
          </dt>
          <dd onClick={close} className="text-sm">
            <Link
              href={`/${revolutionId}/users/${profile.username}`}
              className="text-zinc-500 duration-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              View profile
            </Link>
          </dd>
        </dl>
      </div>
      <div className="flex items-center space-x-1.5">
        <button
          className="absolute right-5 inline-flex text-zinc-500 duration-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
          type="button"
          onClick={() => setIsEditing(true)}
        >
          <MobileConditionalTooltip subtitle="Edit profile">
            <SvgEdit className="size-5" />
          </MobileConditionalTooltip>
        </button>
      </div>
    </div>
  );
};
