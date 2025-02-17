"use client";

import { IProfile } from "@cobuild/database/types";
import { useProfile } from "@cobuild/libs/hooks/useProfile";

type Props = {
  address: `0x${string}`;
  children: (profile: IProfile) => JSX.Element;
};

export const UserProfileClient = (props: Props) => {
  const { address, children } = props;
  const profile = useProfile(address);

  return children(profile);
};
