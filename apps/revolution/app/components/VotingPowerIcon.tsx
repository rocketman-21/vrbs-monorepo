"use client";

import Zap from "@cobuild/ui/pixel-icons/Zap";
import clsx from "classnames";
import Image from "next/image";
import { useRevolution } from "../libs/useRevolution";

export const VotingPowerIcon = (props: { className: string }) => {
  const { className } = props;
  const { config } = useRevolution();

  if (!config.upvoteIcon) return <Zap className={clsx("w-auto", className)} />;

  return (
    <Image
      src={config.upvoteIcon.hasVotedUrl}
      width={config.upvoteIcon.width}
      height={config.upvoteIcon.height}
      alt=""
      className={clsx("w-auto", className)}
    />
  );
};
