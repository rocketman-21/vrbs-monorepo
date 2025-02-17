import { Registry } from "@allo-team/allo-v2-sdk/";

import { Chain, base, sepolia } from "viem/chains";

export function createAlloRegistry(env: "mainnet" | "testnet" = "mainnet") {
  const isTestnet = env === "testnet";

  const chains: Chain[] = [];

  if (isTestnet) {
    // only sepolia supported right now
    chains.push(sepolia);
  } else {
    chains.push(base);
  }

  return new Registry({ chain: chains[0].id });
}

export const alloRegistry = createAlloRegistry("mainnet");
