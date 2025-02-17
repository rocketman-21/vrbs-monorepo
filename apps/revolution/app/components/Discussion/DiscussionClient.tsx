"use client";

import { IScope } from "@cobuild/database/types";
import { Scrollable } from "@cobuild/ui/atoms/Scrollable";
import { Skeleton } from "@cobuild/ui/atoms/Skeleton";
import SvgMessageClock from "@cobuild/ui/pixel-icons/MessageClock";
import classNames from "classnames";
import { useRef } from "react";
import AddComment from "./AddComment";
import Comments from "./Comments";
import { useComments } from "./useComments";

interface Props {
  scope: IScope;
  variant?: "base" | "compact";
  formPosition?: "top" | "bottom";
  autofocus?: boolean;
}

export const DiscussionClient = (props: Props) => {
  const { scope, variant = "base", formPosition = "top", autofocus } = props;
  const { comments, isLoading } = useComments(scope);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        className={classNames("", {
          "mb-6": formPosition === "top",
          "order-last mt-6": formPosition === "bottom",
        })}
      >
        <AddComment
          scope={scope}
          variant={variant}
          onSuccess={() => {
            ref.current?.scrollTo({ top: 0, behavior: "smooth" });
          }}
          isServerSide={false}
          autofocus={autofocus}
        />
      </div>

      {comments?.length > 0 && (
        <div ref={ref} className="flex h-full flex-col overflow-hidden">
          <Scrollable vertical classID="pr-1">
            <Comments comments={comments} variant={variant} isServerSide={false} />
          </Scrollable>
        </div>
      )}

      {comments?.length === 0 && !isLoading && (
        <div className="mt-8 flex flex-col items-center justify-center">
          <SvgMessageClock className="h-8 w-8 text-zinc-500 dark:text-white/30" />
          <div className="mt-2.5 text-xs font-medium text-zinc-700 dark:text-white/40">
            No comments so far...
          </div>
        </div>
      )}

      {isLoading && <Skeleton count={1} height={72} className="my-2" rounded />}
    </>
  );
};
