"use client";

import { IGrantVote } from "@cobuild/database/types";
import { Button } from "@cobuild/ui/atoms/Button";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import clsx from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import pluralize from "pluralize";
import { PERCENTAGE_SCALE } from "./useGrantsVote";

interface Props {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  votes: IGrantVote[];
  canVote: boolean;
  totalBps: number;
  leftBps: number;
  votedCount: number;
  saveVotes: () => Promise<void>;
}

export const GrantsVotingBar = (props: Props) => {
  const { isEditing, setIsEditing, canVote, totalBps, leftBps, votedCount, saveVotes } = props;

  return (
    <AnimatePresence>
      {isEditing && canVote && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="bg-secondary-100 fixed inset-x-0 bottom-0 z-10 py-4"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 max-sm:space-y-2.5 md:flex-row lg:px-6">
            <p>
              You allocated{" "}
              <strong className={clsx({ "text-green-500": totalBps === PERCENTAGE_SCALE })}>
                {totalBps / 1e4}%
              </strong>{" "}
              of your votes to <strong>{votedCount}</strong> {pluralize("initiative", votedCount)}.{" "}
              {leftBps === 0 && "Looking good 👌"}
              {leftBps > 0 && (
                <>
                  You have <strong className="text-red-500">{leftBps / 1e4}%</strong> left.
                </>
              )}
              {leftBps < 0 && (
                <>
                  You over allocated{" "}
                  <strong className="text-red-500">{Math.abs(leftBps / 1e4)}%</strong> votes.
                </>
              )}
            </p>
            <div className="flex items-center space-x-4">
              <Button color="transparent" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Tooltip
                subtitle={
                  totalBps !== PERCENTAGE_SCALE ? "Please allocate 100% of your votes" : undefined
                }
              >
                <Button
                  size="lg"
                  disabled={totalBps !== PERCENTAGE_SCALE}
                  onClick={() => saveVotes()}
                >
                  Save votes
                </Button>
              </Tooltip>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
