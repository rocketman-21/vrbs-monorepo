"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useCallback } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { useUser } from "./useUser";

export const useCheckWallet = (chainId?: number) => {
  const { login, isAuthenticated, isConnected, connect } = useUser();
  const { address: walletAddress, chain: walletChain } = useAccount();
  const { walletConnector } = useDynamicContext();
  const { switchChainAsync } = useSwitchChain();

  const checkWallet = useCallback(async () => {
    if (!isAuthenticated) {
      login();
      return false;
    }

    if (!isConnected || !walletAddress || !walletChain) {
      connect();
      return false;
    }

    if (chainId && walletChain.id !== chainId) {
      if (walletConnector?.supportsNetworkSwitching()) {
        try {
          console.log("switching via wallet connector");
          await walletConnector.switchNetwork({ networkChainId: chainId });

          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (e) {
          console.error(e);
          return false;
        }
      } else if (switchChainAsync) {
        try {
          console.log("switching via switchChainAsync");
          const chain = await switchChainAsync({ chainId });

          if (chain?.id === chainId) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (e) {
          console.error(e);
          return false;
        }

        return false;
      }
    }

    return true;
  }, [
    isAuthenticated,
    isConnected,
    walletAddress,
    walletChain,
    chainId,
    login,
    connect,
    walletConnector,
    switchChainAsync,
  ]);

  return { checkWallet, connectedAddress: walletAddress, walletChain };
};
