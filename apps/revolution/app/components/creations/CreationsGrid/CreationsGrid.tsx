"use client";

import { IContest } from "@cobuild/database/models/revolution/contests/IContest";
import { ICreationsFilter } from "@cobuild/libs/revolution/interfaces";
import { EmptyState } from "@cobuild/ui/atoms/EmptyState/EmptyState";
import { Skeleton } from "@cobuild/ui/atoms/Skeleton";
import { LoadMoreButton } from "app/components/LoadMoreButton";
import { useSubmissions, useSubmissionsCount } from "app/libs/useSubmissions";
import clsx from "classnames";
import { CreationsGridItem } from "./CreationsGridItem";

interface Props {
  contractAddress: `0x${string}`;
  filter: ICreationsFilter;
  perPage?: number;
  creatorAddress?: string;
  columns?: 4 | 5;
  contest?: IContest;
}

export const CreationsGrid = (props: Props) => {
  const {
    contractAddress,
    filter,
    creatorAddress,
    columns = 4,
    perPage = columns === 4 ? 16 : 15,
    contest,
  } = props;

  const { data, isLoading, ...pagination } = useSubmissions({
    perPage,
    filter,
    contractAddress,
    creatorAddress,
  });

  const totalCount = useSubmissionsCount({ filter, contractAddress, creatorAddress });

  const rewardsFilter = contest?.paidOut ? "auctioned" : "next-up";

  return (
    <>
      {!isLoading && totalCount === 0 && (
        <div className="flex items-center justify-center py-16">
          <EmptyState text="No results matching the criteria..." illustration="settings" />
        </div>
      )}

      <div
        className={clsx("grid grid-cols-2 gap-1 md:grid-cols-2 md:gap-2.5 lg:grid-cols-3", {
          "xl:grid-cols-4": columns === 4,
          "xl:grid-cols-5": columns === 5,
        })}
      >
        {isLoading && !data && (
          <Skeleton count={2 * columns} height={346} className="max-sm:!h-60" rounded />
        )}
        {data?.map((submission, index) => (
          <CreationsGridItem
            key={submission.slug}
            rank={filter === rewardsFilter && !creatorAddress ? index + 1 : undefined}
            submission={submission}
            contest={contest}
          />
        ))}
      </div>
      {(totalCount || 0) > (data?.length || 0) && (
        <div className="mt-4">
          <LoadMoreButton {...pagination} isLoading={isLoading} autoload />
        </div>
      )}
    </>
  );
};
