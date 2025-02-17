"use client";

import { IDraft, Serialized } from "@cobuild/database/types";
import { useLocalApi } from "@cobuild/libs/api/useLocalApi";
import { mutate } from "swr";

export function useDrafts(args: {
  revolutionId: string;
  phrase?: string;
  sort?: string;
  status?: string;
}) {
  const { revolutionId, ...params } = args;

  const { data, ...rest } = useLocalApi<Serialized<IDraft>[]>(
    `/${revolutionId}/routes/drafts/?${new URLSearchParams(params).toString()}`,
  );

  return {
    ...rest,
    drafts: data || [],
    mutate: () =>
      mutate(key => typeof key === "string" && key.startsWith(`/${revolutionId}/routes/drafts/`)), // Ignore search params when mutating
  };
}
