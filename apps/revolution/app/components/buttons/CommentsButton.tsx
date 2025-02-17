"use client";

import Comment from "@cobuild/ui/pixel-icons/Comment";
import clsx from "classnames";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useComments } from "../Discussion/useComments";

interface Props {
  slug: string;
  onClick?: () => void;
}

export const CommentsButton = (props: Props) => {
  const { onClick, slug } = props;

  const ref = useRef(null);
  const isInView = useInView(ref);

  const { commentsCount } = useComments({ id: slug, type: "submission" }, !isInView);

  return (
    <button
      className="group/comments-btn flex w-full flex-col items-center justify-center text-white outline-none"
      onClick={onClick}
      ref={ref}
    >
      <Comment className="h-5 w-5" />
      <span
        className={clsx(
          "mt-0.5 flex text-xs font-medium tabular-nums leading-normal tracking-tighter text-white",
          {
            "lg:group-hover/comments-btn:text-lead-200 duration-150": !!onClick,
          },
        )}
      >
        {commentsCount || 0}
      </span>
    </button>
  );
};
