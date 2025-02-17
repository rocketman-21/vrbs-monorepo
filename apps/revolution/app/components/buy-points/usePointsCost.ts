"use client";

import { getGovernanceTokenCost } from "@cobuild/libs/web3/auction/governance-token";
import { useRevolution } from "app/libs/useRevolution";
import { useEffect, useState } from "react";
import { parseEther } from "viem";

export function usePointsCost(amount: number) {
  const [cost, setCost] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addresses, points, chainId } = useRevolution();

  const pointsEmitter = addresses?.pointsEmitter;

  useEffect(() => {
    if (!pointsEmitter || !points) return;

    if (!amount) {
      setCost(null);
      return;
    }

    try {
      setIsLoading(true);
      getGovernanceTokenCost(pointsEmitter, chainId, amount).then(points => {
        setCost(points);
        setIsLoading(false);
      });
    } catch (error: any) {
      console.error(error);
      setCost(null);
      setIsLoading(false);
    }
  }, [pointsEmitter, amount, chainId, points]);

  return {
    cost,
    isCostLoading: isLoading,
    points,
  };
}
