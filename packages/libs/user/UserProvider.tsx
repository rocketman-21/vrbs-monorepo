"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";
import { createContext, PropsWithChildren, useCallback, useEffect } from "react";
import { IProfile } from "../../database/types";
import { removeAccessToken, setAccessToken } from "./access-token";
import { getDynamicEnvironmentId } from "./dynamic-config";
import { useAccount } from "wagmi";

export interface IUserContext {
  user: `0x${string}` | null;
  profile: IProfile | null;
  isAuthenticated: boolean;
  isConnected: boolean;
  votingPower: bigint;
  governancePower: bigint;
  logout: () => void;
  login: () => void;
  connect: () => void;
}

export const UserContext = createContext<IUserContext | undefined>(undefined);
UserContext.displayName = "UserContext";

export const UserProvider = (
  props: PropsWithChildren<{
    revolutionId: string;
    votingPower: string;
    governancePower: string;
    profile: IProfile | null;
  }>,
) => {
  const { votingPower, governancePower, revolutionId, profile } = props;
  const { handleLogOut, setShowAuthFlow, isAuthenticated, user, authToken, walletConnector } =
    useDynamicContext();
  const { isConnected } = useAccount();

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) removeAccessToken();
  }, [isAuthenticated]);

  useEffect(() => {
    if (authToken) setAccessToken(authToken);
  }, [authToken]);

  const logout = useCallback(async () => {
    removeAccessToken();
    await handleLogOut();
    router.refresh();
  }, [handleLogOut, router]);

  //if current revolution ever updates to new community managed dynamic auth, log out user
  useEffect(() => {
    if (!user || !user.environmentId) return;
    if (user.environmentId !== getDynamicEnvironmentId(revolutionId)) {
      console.log("envId mismatch, logging out user");
      logout();
    }
  }, [user, logout, revolutionId]);

  return (
    <UserContext.Provider
      value={{
        user: profile?.address || null,
        profile,
        isAuthenticated,
        isConnected,
        login: () => {
          setShowAuthFlow(true);

          if (!isConnected && walletConnector) {
            walletConnector.connect();
          }
        },
        logout,
        votingPower: BigInt(votingPower),
        governancePower: BigInt(governancePower),
        connect: () => (walletConnector ? walletConnector.connect() : setShowAuthFlow(true)),
      }}
      {...props}
    />
  );
};
