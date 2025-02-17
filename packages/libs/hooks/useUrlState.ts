"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { isBrowser } from "../utils/dom";

export function useUrlState<T extends string>(key: string, defaultValue?: T) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const urlValue = searchParams.get(key)?.toString();
  const [stateValue, setStateValue] = useState(urlValue || defaultValue || null);

  const setParam = useCallback(
    (value: string, scroll = true): void => {
      setStateValue(value);

      const newSearchParams = new URLSearchParams(searchParams?.toString());

      if (value && value.length > 0) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }

      startTransition(() => {
        router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll });
      });
    },
    [key, pathname, router, searchParams],
  );

  useEffect(() => {
    setStateValue(urlValue || defaultValue || null);
  }, [urlValue, defaultValue]);

  return [stateValue === "" ? null : stateValue, setParam, isPending] as const;
}

//set url state for multiple keyvalues
export function useSetUrlState() {
  const readOnlyParams = useSearchParams();
  const searchParamsArray = Array.from(readOnlyParams.entries());
  const router = useRouter();
  const searchParams = new URLSearchParams(isBrowser() ? searchParamsArray : []);
  const pathname = usePathname();
  const [_, startTransition] = useTransition();

  const setParams = (params: Record<string, string>) => {
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.set(key, value);
      else searchParams.delete(key);
    });

    startTransition(() => {
      router.replace(`${pathname}?${searchParams.toString()}`);
    });
  };

  return setParams;
}
