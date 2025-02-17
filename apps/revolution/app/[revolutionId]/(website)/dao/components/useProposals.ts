"use client";

import { IProposal, Serialized } from "@cobuild/database/types";
import { useLocalApi } from "@cobuild/libs/api/useLocalApi";

export function useProposals(args: {
  revolutionId: string;
  entityId: string;
  phrase: string;
  sort: string;
  status: string;
}) {
  const { revolutionId, ...params } = args;

  const { data, ...rest } = useLocalApi<Serialized<IProposal>[]>(
    `/${revolutionId}/routes/proposals/?${new URLSearchParams(params).toString()}`,
  );

  return {
    proposals: data || [],
    ...rest,
  };
}
