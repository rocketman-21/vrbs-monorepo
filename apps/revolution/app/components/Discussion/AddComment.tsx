"use client";

import { localApi } from "@cobuild/libs/api/local";
import { useRevolutionConfig } from "@cobuild/libs/hooks/useRevolutionConfig";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { Button } from "@cobuild/ui/atoms/Button";
import TextArea from "@cobuild/ui/atoms/TextArea";
import { toast } from "@cobuild/ui/organisms/Notifications";
import cx from "classnames";
import { useRouter } from "next/navigation";
import { Post, Scope } from "prisma-database";
import { useEffect, useState, useTransition } from "react";
import { useComments } from "./useComments";

type Props = {
  scope: Scope;
  rootPostId?: string;
  parentPostId?: string;
  onSuccess?: (post: Post) => void;
  variant?: "base" | "compact";
  autosize?: boolean;
  placeholder?: string;
  isServerSide?: boolean;
  autofocus?: boolean;
};

export const AddComment = (props: Props) => {
  const {
    scope,
    parentPostId,
    rootPostId,
    onSuccess = () => undefined,
    variant = "base",
    autosize = true,
    isServerSide = true,
    autofocus,
  } = props;
  const router = useRouter();

  const [isLoading, startTransition] = useTransition();
  const [content, setContent] = useState("");
  const [placeholder, setPlaceholder] = useState("Sign in to add comment...");
  const { isAuthenticated, login, profile } = useUser();
  const { mutate } = useComments(scope, isServerSide);
  const [disabled, setIsDisabled] = useState(false);
  const { revolutionId } = useRevolutionConfig();

  const onSubmitComment = async () => {
    if (content.trim().length === 0) return;

    try {
      startTransition(async () => {
        const response: { post: Post } = await localApi()
          .url(`/${revolutionId}/routes/discussion/comment`)
          .post({ scope, parentPostId, rootPostId, content })
          .json();

        setContent("");
        onSuccess(response.post);
        isServerSide ? router.refresh() : mutate();
      });
    } catch (e) {
      console.error(e);
      toast.error("Error saving your comment.");
    }
  };

  const isReply = !!parentPostId;

  useEffect(() => {
    if (!isAuthenticated) setPlaceholder("Sign in to add comment...");
    setPlaceholder(isReply ? "Reply..." : "Your comment...");
  }, [isAuthenticated, isReply]);

  useEffect(() => {
    setIsDisabled(isLoading || !isAuthenticated);
  }, [isAuthenticated, isLoading]);

  return (
    <div
      className={cx("flex items-center", {
        "max-w-xl rounded-xl bg-black/5 py-px dark:bg-black/30": variant === "compact",
      })}
      onClick={e => {
        if (!isAuthenticated) {
          e.stopPropagation();
          login();
        }
      }}
    >
      <div className={cx("ml-1 mr-3 h-7 w-7", { "lg:h-10 lg:w-10": variant === "base" })}>
        <Avatar id={profile?.username || "Guest"} imageUrl={profile?.profilePicture} size={40} />
      </div>
      <div
        className={cx("flex flex-1 space-x-1.5", {
          "items-end": variant === "base",
          "items-center": variant === "compact",
        })}
      >
        <TextArea
          name="comment"
          className="h-auto w-full resize-y rounded-[12px] border-none text-black outline-none dark:text-white"
          value={content}
          rows={1}
          autosize={autosize}
          showBorder={variant === "base"}
          size={variant === "base" ? "md" : "sm"}
          disabled={disabled}
          onChange={e => setContent(e.target.value)}
          onSubmit={onSubmitComment}
          placeholder={placeholder}
          autoFocus={autofocus}
        />
        <Button
          size={variant === "compact" ? "base" : "md"}
          disabled={disabled}
          onClick={onSubmitComment}
        >
          {isLoading ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
};

export default AddComment;
