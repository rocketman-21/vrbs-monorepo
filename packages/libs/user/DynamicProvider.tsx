"use client";

import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
import { setAccessToken } from "./access-token";
import { EthereumWalletConnectors, DynamicContextProvider } from "./dynamic";
import { getDynamicConfig } from "./dynamic-config";
import { DynamicWagmi } from "./WagmiProvider";

interface Props {
  revolutionId: string;
}

export const DynamicProvider = (props: PropsWithChildren<Props>) => {
  const { revolutionId, children } = props;
  const router = useRouter();

  return (
    <DynamicContextProvider
      settings={{
        ...getDynamicConfig(revolutionId),
        walletConnectors: [EthereumWalletConnectors],
        eventsCallbacks: {
          onAuthSuccess: async ({ authToken }) => {
            {
              await setAccessToken(authToken);
              router.refresh();
            }
          },
        },
      }}
    >
      <DynamicWagmi>{children}</DynamicWagmi>
    </DynamicContextProvider>
  );
};
