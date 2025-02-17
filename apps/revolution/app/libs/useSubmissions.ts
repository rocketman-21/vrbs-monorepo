"use client";

import { ISubmission, Serialized } from "@cobuild/database/types";
import { useLocalApi, useLocalApiInfinite } from "@cobuild/libs/api/useLocalApi";
import { ICreationsFilter } from "@cobuild/libs/revolution/interfaces";
import { useRevolution } from "./useRevolution";

type Props = {
  contractAddress: `0x${string}`;
  filter: ICreationsFilter;
  perPage: number;
  creatorAddress?: string;
};

export function useSubmissions(props: Props) {
  const { perPage, filter, contractAddress, creatorAddress = "" } = props;
  const { revolutionId } = useRevolution();

  const params = new URLSearchParams({
    contractAddress,
    filter,
    perPage: `${perPage}`,
    creatorAddress,
  });

  const { isLoading, ...rest } = useLocalApiInfinite<Serialized<ISubmission, "creatorProfiles">>(
    page =>
      perPage > 0 ? `/${revolutionId}/routes/submissions?page=${page}&${params}` : undefined,
  );

  return {
    isLoading: perPage === 0 || isLoading,
    ...rest,
  };
}

export function useSubmissionsCount(props: Omit<Props, "perPage">) {
  const { filter, creatorAddress, contractAddress } = props;
  const { revolutionId } = useRevolution();

  const params = new URLSearchParams({
    contractAddress,
    filter,
    creatorAddress: creatorAddress?.toLowerCase() || "",
  });

  const { data } = useLocalApi<number>(
    `/${revolutionId}/routes/submissions?justCount=true&${params}`,
  );

  return data;
}
