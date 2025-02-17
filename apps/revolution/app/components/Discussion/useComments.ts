"use client";

import { IPost, Serialized } from "@cobuild/database/types";
import { useLocalApi } from "@cobuild/libs/api/useLocalApi";
import { useRevolutionConfig } from "@cobuild/libs/hooks/useRevolutionConfig";
import { Scope } from "prisma-database";

export function useComments(scope: Scope, skip = false) {
  const { revolutionId } = useRevolutionConfig();

  const { data = [], ...rest } = useLocalApi<Serialized<IPost>[]>(
    `/${revolutionId}/routes/discussion/comments?type=${scope.type}&id=${scope.id}`,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    },
    skip,
  );

  return {
    scope,
    comments: data,
    commentsCount: data.reduce((acc, comment) => (acc += 1 + comment.childrenCount), 0),
    ...rest,
  };
}
