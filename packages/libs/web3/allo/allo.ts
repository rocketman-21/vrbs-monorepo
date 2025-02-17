import { Allo } from "@allo-team/allo-v2-sdk/";

import { Chain, base, sepolia } from "viem/chains";

export function createAlloClient(env: "mainnet" | "testnet" = "mainnet") {
  const isTestnet = env === "testnet";

  const chains: Chain[] = [];

  if (isTestnet) {
    // only sepolia supported right now
    chains.push(sepolia);
  } else {
    chains.push(base);
  }

  return new Allo({ chain: chains[0].id });
}

export const alloClient = createAlloClient("testnet");
