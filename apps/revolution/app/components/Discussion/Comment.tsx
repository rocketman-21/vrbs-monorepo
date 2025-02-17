"use client";

import { IPost, Serialized } from "@cobuild/database/types";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { shortenIfEthAddress, shortenUsername } from "@cobuild/libs/utils/account";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import DateRelative from "@cobuild/ui/atoms/DateRelative";
import CommentIcon from "@cobuild/ui/pixel-icons/Comment";
import { useRevolution } from "app/libs/useRevolution";
import cx from "classnames";
import Link from "next/link";
import { Profile } from "prisma-database";
import { useState } from "react";
import { getAddress } from "viem";
import { UserProfilePopover } from "../user-profile/UserProfilePopover";
import { AddComment } from "./AddComment";
import { CommentBody } from "./CommentBody";
import { Comments } from "./Comments";
import { UpvoteButton } from "./UpvoteButton";

interface Props {
  comment: (Serialized<IPost> & { children?: Serialized<IPost>[]; profile?: Profile }) | null;
  level: number;
  variant?: "base" | "compact";
  isServerSide?: boolean;
}

export const Comment = (props: Props) => {
  const { comment, level, variant, isServerSide } = props;

  if (!comment) {
    throw new Error("Comment: comment is required");
  }
  const { isAuthenticated, login } = useUser();

  const [isCommenting, setIsCommenting] = useState(false);
  const { revolutionId } = useRevolution();

  const { profile } = comment;
  const username = shortenUsername(profile?.username || comment.address);

  return (
    <div className="flex flex-row items-start">
      <div
        className={cx("mr-1.5 h-5 w-5 rounded-lg", {
          "md:h-12 md:w-12": variant === "base",
        })}
      >
        <Avatar id={comment.address} imageUrl={comment.profile?.profilePicture} size={40} />
      </div>
      <div
        className={cx("relative flex-1", {
          "before:absolute before:bottom-0 before:left-[-40px] before:top-[58px] before:block before:w-px before:bg-[#161C3926] before:content-['']":
            level === 1 && variant === "base",
        })}
      >
        <section className="relative space-y-1 text-black dark:text-white">
          <div className="flex items-center space-x-1.5">
            <UserProfilePopover
              profile={{
                address: getAddress(comment.address),
                username,
                profilePicture: profile?.profilePicture || null,
                bio: profile?.bio || null,
                website: profile?.website || null,
                displayUsername: shortenIfEthAddress(username),
              }}
              revolutionId={revolutionId}
            >
              <Link
                href={`/${revolutionId}/users/${username}`}
                className={cx(
                  "hover:text-lead-500 dark:hover:text-lead-300 max-w-[120px] truncate font-medium lg:max-w-[180px]",
                  {
                    "text-sm md:text-base": variant === "base",
                    "text-[13px]": variant === "compact",
                  },
                )}
              >
                {username}
              </Link>
            </UserProfilePopover>
            <div
              className={cx("text-zinc-500", {
                "text-sm": variant === "base",
                "text-xs": variant === "compact",
              })}
            >
              <DateRelative date={comment.createdAt.toString()} variant="short" />
            </div>
          </div>

          <div
            className={cx({
              "text-sm md:text-base": variant === "base",
              "text-[13px]": variant === "compact",
            })}
          >
            <CommentBody markdown={comment.markdown || ""} />
          </div>
          <div className="flex items-center gap-x-4 pt-1.5 text-xs">
            <UpvoteButton postId={comment.postId || ""} upvotes={comment.upvotes || []} />

            {level < 3 && (
              <button
                className="flex select-none items-center space-x-1.5 text-zinc-500 opacity-75 duration-150 hover:opacity-100"
                onClick={() => (isAuthenticated ? setIsCommenting(!isCommenting) : login())}
              >
                <CommentIcon className="h-4 w-4" />
                <span>{comment.childrenCount}</span>
              </button>
            )}
          </div>
        </section>

        {isCommenting && isAuthenticated && (
          <div className="my-4">
            <AddComment
              scope={comment.scope}
              parentPostId={comment.postId}
              rootPostId={comment.rootPostId || undefined}
              onSuccess={() => setIsCommenting(false)}
              variant={variant}
              isServerSide={isServerSide}
              autofocus
            />
          </div>
        )}

        {level < 3 && !!comment.children?.length && (
          <div className="mt-4">
            <Comments
              comments={comment.children}
              level={level + 1}
              variant={variant}
              isServerSide={isServerSide}
            />
          </div>
        )}
      </div>
    </div>
  );
};
