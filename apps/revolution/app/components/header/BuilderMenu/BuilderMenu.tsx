"use client";

import { IGrant, Serialized } from "@cobuild/database/types";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { calculateUserSalary } from "@cobuild/libs/revolution/salary";
import { Button } from "@cobuild/ui/atoms/Button";
import EmptyState from "@cobuild/ui/atoms/EmptyState/EmptyState";
import { Popover } from "@cobuild/ui/molecules/Popover/Popover";
import { AnimatedEarnings } from "app/components/AnimatedEarnings";
import { useRevolution } from "app/libs/useRevolution";
import Link from "next/link";
import { EarningsTable } from "./EarningsTable";

interface Props {
  user: `0x${string}` | null;
  grants: Serialized<IGrant, "isMemberConnectedToPool">[];
}

export const BuilderMenu = (props: Props) => {
  const { user, grants } = props;

  const { name, revolutionId, socialLinks, farcasterChannelId } = useRevolution();
  if (revolutionId !== "vrbs") return null;

  const hasGrants = user && grants.length > 0;

  const salary = hasGrants ? calculateUserSalary(grants) : null;

  const { profile } = useUser();

  const isEvening = new Date().getHours() >= 19;

  return (
    <Popover
      button={({ isOpen }) => (
        <span className="bg-lead-300 hover:bg-lead-200 dark:border-lead-300 dark:hover:border-lead-100 relative flex min-w-16 select-none rounded-xl px-2.5 py-1 duration-150 dark:border dark:bg-transparent">
          <span className="text-[13px] font-medium">
            <AnimatedEarnings
              earnings={salary?.totalUnclaimed || 0}
              flowRate={salary?.memberFlowRate || 0}
            />
          </span>
        </span>
      )}
      placement="bottom-end"
    >
      {({ close, isOpen }) => (
        <div className="mt-2.5 w-full rounded-lg md:w-[480px] md:border md:border-zinc-100 md:bg-white/95 md:shadow-lg md:backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-800/95">
          <div className="p-2.5 md:p-5">
            {hasGrants && (
              <>
                <h3>
                  {isEvening ? "good evening" : "gm"}{" "}
                  {profile ? (
                    <strong className="font-medium">{profile.displayUsername}</strong>
                  ) : (
                    ""
                  )}
                </h3>
                {salary && (
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                    You&apos;re earning{" "}
                    {Intl.NumberFormat("en", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(salary.yearly)}{" "}
                    / yr with {name}.
                  </p>
                )}
                <hr className="my-5 border-zinc-200 dark:border-zinc-600" />
                <EarningsTable grants={grants} />
                <div className="mt-4 flex w-full flex-row items-center justify-between space-x-2">
                  <a
                    href={
                      farcasterChannelId
                        ? `https://warpcast.com/~/compose?channelKey=${farcasterChannelId}`
                        : socialLinks.twitter
                    }
                    target="_blank"
                  >
                    <Button>Post update</Button>
                  </a>
                  <Link href={`/${revolutionId}/rewards?createSplit=true`}>
                    <Button color="outline">Create split</Button>
                  </Link>
                </div>
              </>
            )}
            {!hasGrants && (
              <EmptyState illustration="researching" size="sm" imageSize={156}>
                <p className="text-center text-sm">
                  {" "}
                  Help us grow {name}, make positive impact in the world and get paid every second.
                </p>
                <div className="flex flex-row space-x-2">
                  <Link href={`/${revolutionId}/grants`}>
                    <Button>Check Grants</Button>
                  </Link>
                  <Link href={`/${revolutionId}/rewards?createSplit=true`}>
                    <Button color="outline">Create Split</Button>
                  </Link>
                </div>
              </EmptyState>
            )}
          </div>
        </div>
      )}
    </Popover>
  );
};
