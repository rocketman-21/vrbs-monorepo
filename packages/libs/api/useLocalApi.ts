"use client";

import { useState } from "react";
import useSWR, { KeyedMutator, SWRConfiguration } from "swr";
import useSWRInfinite, { SWRInfiniteConfiguration } from "swr/infinite";
import { getAccessToken } from "../user/access-token";

export function useLocalApi<Data = any>(
  url: string,
  options?: SWRConfiguration,
  skip?: boolean,
  refreshIntervalSeconds?: number,
): {
  data: Data | undefined;
  error: any;
  isLoading: boolean;
  mutate: KeyedMutator<Data>;
} {
  const absoluteUrl = skip || !url ? undefined : url;
  const { data, error, mutate } = useSWR(absoluteUrl, fetcherWithAccessToken, {
    ...options,
    refreshInterval: refreshIntervalSeconds ? refreshIntervalSeconds * 1000 : undefined,
  });
  const isLoading = skip || !url ? false : !error && (data === undefined || data == null);

  return { data, error, isLoading, mutate };
}

export function useLocalApiInfinite<Data = any>(
  url: (page: number) => string | undefined,
  options?: SWRInfiniteConfiguration<Data>,
) {
  const [hasMore, setHasMore] = useState(true);

  const { data, ...rest } = useSWRInfinite<Data>(
    (page, previousPageData) => {
      if (previousPageData && !previousPageData.length) {
        setHasMore(false);
        return null;
      }

      return url(page);
    },
    fetcherWithAccessToken,
    options,
  );

  return { data: data?.flat(1), hasMore, ...rest };
}

async function fetcherWithAccessToken(url: string) {
  const token = getAccessToken();
  const options: any = {};
  options.headers = token ? { Authorization: `Bearer ${token}` } : {};

  return fetch(url, options).then(async res => {
    if (!res.ok) throw await res.json();
    return res.json();
  });
}
