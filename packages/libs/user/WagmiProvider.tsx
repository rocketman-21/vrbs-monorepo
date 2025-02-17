"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import {
  arbitrum,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
} from "wagmi/chains";
import { DynamicWagmiConnector } from "./dynamic";

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

const config = createConfig({
  chains: [mainnet, sepolia, base, baseSepolia, optimism, optimismSepolia],
  ssr: true,
  transports: {
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    [sepolia.id]: http(),
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    [baseSepolia.id]: http(),
    [optimism.id]: http(`https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    [optimismSepolia.id]: http(),
    [arbitrum.id]: http(),
  },
});

export const DynamicWagmi = (props: PropsWithChildren) => {
  const { children } = props;
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
