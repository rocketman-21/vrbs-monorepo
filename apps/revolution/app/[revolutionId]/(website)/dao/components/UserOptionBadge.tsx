"use client";

import Check from "@cobuild/ui/pixel-icons/Check";
import { ProposalOption } from "@cobuild/database/types";
import clsx from "classnames";
import { motion } from "framer-motion";

interface Props {
  option: ProposalOption;
  showVoteText?: boolean;
}

export const UserOptionBadge = (props: Props) => {
  const { option, showVoteText } = props;
  if (!option) return null;

  const { color, name } = option;

  return (
    <div
      className={clsx("flex h-[26px] items-center space-x-1 rounded-xl px-1.5 text-xs", {
        "text-white": !!color,
      })}
      style={{ backgroundColor: color }}
    >
      <Check className="h-3.5 w-3.5" />
      <motion.span
        variants={{
          hidden: { width: 0, marginLeft: 0, marginRight: 0 },
          visible: { width: "auto", marginLeft: 4, marginRight: 2 },
        }}
        initial={showVoteText ? "visible" : "hidden"}
        animate={showVoteText ? "visible" : "hidden"}
        className="overflow-hidden capitalize"
      >
        {name}
      </motion.span>
    </div>
  );
};
