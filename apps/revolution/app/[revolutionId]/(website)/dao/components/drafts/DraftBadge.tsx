import { motion } from "framer-motion";
import { DateRelative } from "@cobuild/ui/atoms/DateRelative";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import CheckIcon from "@cobuild/ui/pixel-icons/Check";
import ClockIcon from "@cobuild/ui/pixel-icons/Clock";

interface Props {
  updatedAt: Date | string;
  isOnChain: boolean;
  showText: boolean;
}

export const DraftBadge = (props: Props) => {
  const { updatedAt, isOnChain, showText } = props;

  const Icon = isOnChain ? CheckIcon : ClockIcon;

  return (
    <div className="flex h-[26px] items-center space-x-1 rounded-xl bg-zinc-400 px-1.5 text-xs font-medium text-white dark:bg-zinc-800 dark:text-white dark:contrast-75">
      <Icon width="14" height="14" />
      <motion.span
        variants={{
          hidden: { width: 0, marginLeft: 0, marginRight: 0 },
          visible: { width: "auto", marginLeft: 4, marginRight: 2 },
        }}
        initial={showText ? "visible" : "hidden"}
        animate={showText ? "visible" : "hidden"}
        className="overflow-hidden"
      >
        {isOnChain && "Published"}
        {!isOnChain && (
          <Tooltip subtitle="Last update">
            <DateRelative date={updatedAt} justNowThreshold={60} variant="short" />
          </Tooltip>
        )}
      </motion.span>
    </div>
  );
};
