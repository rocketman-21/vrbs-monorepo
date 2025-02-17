"use client";

import { useEffect, useState } from "react";
import { CultureIndexData, getCultureIndexData } from "../../revolution/cultureIndex";

export function useCultureIndex(address: `0x${string}` | null, chainId: number | null) {
  const [data, setData] = useState<CultureIndexData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!address || !chainId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getCultureIndexData(address, chainId).then(data => {
      setData(data);
      setIsLoading(false);
    });
  }, [address, chainId]);

  return { cultureIndex: data, isLoading };
}
