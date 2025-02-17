"use client";

import { Profile } from "@cobuild/database/types";
import { shortenIfEthAddress } from "@cobuild/libs/utils/account";
import { truncateString } from "@cobuild/libs/utils/text";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import clsx from "classnames";
import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  url: string;
  title: string;
  address: `0x${string}`;
  numericId?: number;
  isSelected?: boolean;
  profile?: Pick<Profile, "profilePicture" | "username">;
  badges?: ReactNode;
}

export const SidebarListItem = (props: Props) => {
  const { url, isSelected, title, numericId, badges, profile, address } = props;

  return (
    <Link
      href={url}
      className={clsx("group block space-y-2.5 rounded-lg p-2.5 duration-100 ease-in-out lg:p-3", {
        "bg-card hover:bg-lead-100 dark:hover:bg-zinc-800": !isSelected,
        "bg-lead-100 dark:bg-zinc-800 dark:text-white": isSelected,
      })}
    >
      <div className="pr-2 text-[15px] font-medium">
        {numericId && <span className="mr-1.5 text-zinc-500 dark:text-zinc-500">{numericId}</span>}
        {truncateString(title, 20, 'words') || "Untitled Draft"}
      </div>

      <div className="flex items-center justify-between space-x-1">
        <div className="flex items-center space-x-1.5">
          <Avatar id={address} imageUrl={profile?.profilePicture} size={20} />
          <span className="max-w-fit truncate text-sm text-zinc-500 dark:text-zinc-500">
            {shortenIfEthAddress(profile?.username || address)}
          </span>
        </div>
        {badges && <span className="flex items-center space-x-1">{badges}</span>}
      </div>
    </Link>
  );
};
