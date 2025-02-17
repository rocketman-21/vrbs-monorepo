"use client";

import { ISubmission, Serialized } from "@cobuild/database/types";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { UserProfilePopover } from "app/components/user-profile/UserProfilePopover";
import Image from "next/image";
import Link from "next/link";
import { CreationAction } from "./CreationAction";

interface Props {
  submission: Serialized<ISubmission, "creatorProfiles">;
  revolutionId: string;
}

export const CreationFooter = (props: Props) => {
  const { submission, revolutionId } = props;
  const { thumbnailUrl, name, slug } = submission;

  const creator = submission.creatorProfiles[0];

  return (
    <div className="relative shrink-0 grow overflow-hidden bg-white text-zinc-800 dark:bg-zinc-900 dark:text-zinc-50">
      {thumbnailUrl && (
        <div className="absolute inset-0 select-none">
          <Image
            src={thumbnailUrl}
            alt={name}
            width={320}
            height={160}
            className="size-full select-none object-cover opacity-25 blur-xl"
          />
        </div>
      )}
      <div className="relative flex items-center justify-between space-x-1.5 px-2 py-1.5 md:px-4 md:py-2.5">
        <div className="flex flex-col items-start">
          <h1 className="font-medium max-sm:text-sm">
            <Link
              href={`/${revolutionId}/creations/${slug}`}
              className="hover:text-lead-400 line-clamp-1 tracking-tight duration-100"
            >
              {name}
            </Link>
          </h1>
          {creator && (
            <UserProfilePopover profile={creator} revolutionId={revolutionId}>
              <Link
                href={`/${revolutionId}/users/${creator.username}`}
                className="mt-0.5 flex items-center space-x-1.5 truncate text-[11px] md:text-[13px]"
              >
                <Avatar imageUrl={creator.profilePicture} size={16} id={creator.address} />
                <span>{creator.displayUsername}</span>
              </Link>
            </UserProfilePopover>
          )}
        </div>

        <CreationAction submission={submission} revolutionId={revolutionId} />
      </div>
    </div>
  );
};
