"use client";

import Check from "@cobuild/ui/pixel-icons/Check";
import Close from "@cobuild/ui/pixel-icons/Close";
import Hourglass from "@cobuild/ui/pixel-icons/Hourglass";
import LockIcon from "@cobuild/ui/pixel-icons/Lock";
import MailArrowRight from "@cobuild/ui/pixel-icons/MailArrowRight";
import TrendingUp from "@cobuild/ui/pixel-icons/TrendingUp";
import { ProposalStatus } from "@cobuild/database/types";
import classNames from "classnames";
import { motion } from "framer-motion";
import { SVGProps } from "react";

interface Props {
  status: ProposalStatus;
  showStatusText?: boolean;
}

export const StatusIcons: { [status: string]: (props: SVGProps<SVGSVGElement>) => JSX.Element } = {
  active: TrendingUp,
  executed: Check,
  cancelled: Close,
  defeated: Close,
  pending: Hourglass,
  queued: MailArrowRight,
  closed: LockIcon,
  succeeded: Check,
  updateable: Hourglass,
  vetoed: Close,
  objectionperiod: Hourglass,
};

export const StatusBadge = ({ status, showStatusText = true }: Props) => {
  const StatusIcon = StatusIcons[status];

  return (
    <div
      className={classNames(
        "flex h-[26px] items-center rounded-xl px-1.5 text-xs font-medium dark:contrast-75",
        {
          "bg-[#068940] text-white dark:text-black": status === "active",
          "bg-[#0385EB] text-white dark:text-black":
            status === "executed" || status === "succeeded",
          "bg-[#FFB802] text-white dark:text-black":
            status === "pending" || status === "updateable" || status === "objectionperiod",
          "bg-[#807F7E] text-white dark:text-black": status === "cancelled",
          "bg-[#D22209] text-white dark:text-black": status === "defeated" || status === "vetoed",
          "bg-[#2F80ED] text-white dark:text-black": status === "queued",
          "bg-zinc-400 text-white dark:bg-zinc-800 dark:text-white": status === "closed",
        },
      )}
    >
      {StatusIcon && <StatusIcon width="14" height="14" />}
      <motion.span
        variants={{
          hidden: { width: 0, marginLeft: 0, marginRight: 0 },
          visible: { width: "auto", marginLeft: 4, marginRight: 2 },
        }}
        initial={showStatusText ? "visible" : "hidden"}
        animate={showStatusText ? "visible" : "hidden"}
        className="overflow-hidden capitalize"
      >
        {status}
      </motion.span>
    </div>
  );
};
