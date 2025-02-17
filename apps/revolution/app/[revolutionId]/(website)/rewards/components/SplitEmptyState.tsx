"use client";

import { Button } from "@cobuild/ui/atoms/Button";
import { useUrlState } from "@cobuild/libs/hooks/useUrlState";
import { useRevolution } from "app/libs/useRevolution";
import EmptyState from "@cobuild/ui/atoms/EmptyState/EmptyState";
import { useIsMobile } from "@cobuild/libs/hooks/useIsScreenSize";

export default function SplitEmptyState() {
  const [, openCreateSplit] = useUrlState("createSplit");
  const { name } = useRevolution();
  const isMobile = useIsMobile();

  return (
    <>
      <div className="my-12 flex flex-col items-center justify-between space-y-4 py-2.5">
        <EmptyState>
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">No splits yet</h2>
            <h2 className="tracking-tight text-zinc-900 dark:text-white">
              Split onchain revenue with {name}, earn votes.
            </h2>
          </div>
          <Button
            fullWidth={isMobile}
            onClick={() => openCreateSplit("true")}
            color="primary"
            size="lg"
          >
            Create split
          </Button>
        </EmptyState>
      </div>
    </>
  );
}
