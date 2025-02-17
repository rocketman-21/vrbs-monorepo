"use client";

import { localApi } from "@cobuild/libs/api/local";
import { useUser } from "@cobuild/libs/hooks/useUser";
import cx from "classnames";
import { Post } from "prisma-database";
import { useCallback, useEffect, useState } from "react";
import Heart from "@cobuild/ui/pixel-icons/Heart";
import HeartFull from "@cobuild/ui/pixel-icons/HeartFull";
import { toast } from "@cobuild/ui/organisms/Notifications";

type Props = Pick<Post, "upvotes" | "postId">;

export const UpvoteButton = (props: Props) => {
  const { postId, upvotes: initialUpvotes = [] } = props;
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated, login } = useUser();
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const toggleVote = useCallback(async () => {
    try {
      setHasUpvoted(current => !current);
      setIsLoading(true);
      const response: { upvotes: string[] } = await localApi()
        .url("/routes/discussion/upvote")
        .post({ postId })
        .json();
      setUpvotes(response.upvotes);
    } catch {
      setHasUpvoted(current => !current);
      toast.error("Unexpected error. Please try again");
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    setHasUpvoted(!!user && upvotes.includes(user));
  }, [user, upvotes]);

  return (
    <button
      onClick={() => (isAuthenticated ? toggleVote() : login())}
      disabled={isLoading}
      className="flex select-none items-center space-x-1.5 opacity-75 duration-150 hover:opacity-100"
    >
      {hasUpvoted ? <HeartFull className="h-4 w-4" /> : <Heart className="h-4 w-4 text-zinc-500" />}
      <span className={cx("text-zinc-500", { "animate-pulse": isLoading })}>{upvotes.length}</span>
    </button>
  );
};
