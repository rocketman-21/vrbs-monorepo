"use client";

import { Button } from "@cobuild/ui/atoms/Button";
import Skeleton from "@cobuild/ui/atoms/Skeleton";
import { useRevolution } from "app/libs/useRevolution";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { getUserSubmissions } from "./getUserSubmissions";

interface Props {
  address: `0x${string}`;
  updatePosition?: () => void;
  close?: () => void;
}

type UserSubmissions = Awaited<ReturnType<typeof getUserSubmissions>>["submissions"];

export const UserProfilePopoverCreations = (props: Props) => {
  const { address, updatePosition, close } = props;
  const { revolutionId } = useRevolution();
  const [submissions, setSubmissions] = useState<UserSubmissions>([]);
  const [count, setCount] = useState<number>(0);
  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      getUserSubmissions(address, revolutionId).then(data => {
        setSubmissions(data.submissions);
        setCount(data.count);
        if (updatePosition) {
          setTimeout(updatePosition, 50);
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revolutionId, address]);

  return (
    <>
      {(isLoading || count > 0) && <hr className="my-4 dark:border-zinc-600" />}
      <div className="grid grid-cols-4 gap-1">
        {isLoading && <Skeleton count={4} className="aspect-square !h-full rounded" height={74} />}
        {!isLoading &&
          submissions?.map(submission => {
            return (
              <a
                key={submission.slug}
                href={`/${revolutionId}/creations/${submission.slug}`}
                className="duration-100 hover:opacity-75"
                target="_blank"
              >
                {submission.thumbnailUrl && (
                  <Image
                    src={submission.thumbnailUrl}
                    alt={submission.name}
                    width={74}
                    height={74}
                    className="aspect-square h-full w-full rounded object-cover"
                  />
                )}
              </a>
            );
          })}
      </div>
      {isLoading && <Skeleton height={34} className="mt-2 rounded" />}
      {count > 0 && (
        <Link href={`/${revolutionId}/creations/?filter=user&creator=${address}`}>
          <Button
            fullWidth
            className="mt-2"
            color="outline"
            onClick={close ? () => close() : undefined}
            disabled={isLoading || count === 0}
          >
            {count > 4 && <>View {count - 4} more</>}
            {count <= 4 && <>View all</>}
          </Button>
        </Link>
      )}
    </>
  );
};
