"use client";

import { IProfile } from "@cobuild/database/types";
import { truncateString } from "@cobuild/libs/utils/text";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { Popover } from "@cobuild/ui/molecules/Popover/Popover";
import SvgExternalLink from "@cobuild/ui/pixel-icons/ExternalLink";
import clsx from "classnames";
import Image from "next/image";
import { ReactNode } from "react";
import { UserProfilePopoverCreations } from "./UserProfilePopoverCreations";
import Link from "next/link";

interface Props {
  revolutionId: string;
  profile: IProfile;
  children: ReactNode;
  content?: ReactNode;
}

export const UserProfilePopover = (props: Props) => {
  const { content, children, revolutionId, profile } = props;
  const { address, username, profilePicture, bio, website, displayUsername } = profile;

  if (!address) return;

  const hasBio = bio && bio.trim().length > 0;

  return (
    <Popover button={children} onHover>
      {({ updatePosition, close }) => (
        <div className="md:shadow-lead-100 relative rounded-lg p-4 text-sm md:m-2.5 md:w-[340px] md:bg-white md:shadow-md md:ring-1 md:ring-zinc-100 dark:shadow md:dark:bg-zinc-800 md:dark:ring-zinc-700">
          {revolutionId === "vrbs" && (
            <Image
              src={"/images/vrbs/pattern_07.png"}
              alt=""
              width="288"
              height="400"
              className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover opacity-[0.025]"
            />
          )}
          <div className="relative">
            <div
              className={clsx("flex space-x-2.5", {
                "items-start": hasBio || website,
                "items-center": !hasBio && !website,
              })}
            >
              <Avatar id={address} size={40} imageUrl={profilePicture} className="shadow" />
              <div className="grow">
                <h3 className="text-base font-medium">
                  <Link
                    href={`/${revolutionId}/users/${username}`}
                    className="group inline-flex items-center text-zinc-700 duration-100 hover:text-zinc-900 dark:text-zinc-100 dark:hover:text-white"
                  >
                    {displayUsername}
                    <SvgExternalLink className="ml-1.5 size-3.5 opacity-50 duration-100 group-hover:opacity-100" />
                  </Link>
                </h3>
                {bio && (
                  <p className="mb-2.5 whitespace-pre-line text-[13px] text-zinc-500 dark:text-zinc-300">
                    {bio}
                  </p>
                )}
                {website && (
                  <div>
                    <a
                      href={website}
                      rel="nofollow noopener noreferrer"
                      target="_blank"
                      className="hover:text-lead-500 dark:hover:text-lead-400 truncate text-[13px] text-zinc-500 underline duration-100 dark:text-zinc-300"
                    >
                      {truncateString(website, 32).replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {content && (
              <>
                <hr className="my-4 dark:border-zinc-600" />
                {content}
              </>
            )}
            {!content && (
              <UserProfilePopoverCreations
                address={address}
                updatePosition={updatePosition}
                close={close}
              />
            )}
          </div>
        </div>
      )}
    </Popover>
  );
};
