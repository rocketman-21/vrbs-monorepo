"use client";

import { getGovernanceTokenQuote } from "@cobuild/libs/web3/auction/governance-token";
import { useRevolution } from "app/libs/useRevolution";
import { useEffect, useState } from "react";
import { parseEther } from "viem";

export function usePointsQuote(amount: number) {
  const [quote, setQuote] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addresses, points, chainId } = useRevolution();

  const pointsEmitter = addresses?.pointsEmitter;

  useEffect(() => {
    if (!pointsEmitter || !points) return;

    if (!amount) {
      setQuote(null);
      return;
    }

    try {
      setIsLoading(true);
      getGovernanceTokenQuote(pointsEmitter, chainId, Number(parseEther(amount.toString()))).then(
        points => {
          setQuote(points);
          setIsLoading(false);
        },
      );
    } catch (error: any) {
      console.error(error);
      setQuote(null);
      setIsLoading(false);
    }
  }, [pointsEmitter, amount, chainId, points]);

  return {
    quote,
    isQuoteLoading: isLoading,
    points,
  };
}
