"use client";

import { useMemo } from "react";
import { encodeAbiParameters, parseAbiParameters } from "viem";

export const useAlloPoolInitialData = (chainId: number) => {
  //direct grants
  // struct InitializeData {
  //     bool registryGating;
  //     bool metadataRequired;
  //     bool grantAmountRequired;
  // }

  const initStrategyData = useMemo(() => {
    return encodeAbiParameters(parseAbiParameters("bool,bool,bool"), [false, false, false]);
  }, []);

  return { initStrategyData };
};
