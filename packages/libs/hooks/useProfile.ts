"use client";

import { IProfile } from "../../database/types";
import { useLocalApi } from "../api/useLocalApi";
import { getShortEthAddress } from "../utils/account";
import { useRevolutionConfig } from "./useRevolutionConfig";

export function useProfile(address: `0x${string}`): IProfile {
  const { revolutionId } = useRevolutionConfig();

  const { data } = useLocalApi<IProfile>(`/${revolutionId}/routes/user-profile/${address}`, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  });

  return {
    address,
    username: data?.username || getShortEthAddress(address),
    profilePicture: data?.profilePicture || null,
    displayUsername: data?.displayUsername || getShortEthAddress(address),
    website: data?.website || null,
    bio: data?.bio || null,
  };
}
