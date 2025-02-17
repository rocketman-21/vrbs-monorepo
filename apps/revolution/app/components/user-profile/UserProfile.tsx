import "server-only";

import { Profiles } from "@cobuild/database/models/social/Profiles";
import { IProfile } from "@cobuild/database/types";
import { getShortEthAddress } from "@cobuild/libs/utils/account";
import { ReactNode, Suspense } from "react";
import { UserProfilePopover } from "./UserProfilePopover";

type Props = {
  address: `0x${string}`;
  revolutionId: string;
  children: (profile: IProfile) => JSX.Element;
  withPopover?: boolean;
  popover?: ReactNode;
  profile?: IProfile;
};

export const UserProfile = async (props: Props) => {
  const { address, children } = props;

  return (
    <Suspense
      fallback={children({
        address,
        username: getShortEthAddress(address),
        profilePicture: null,
        bio: null,
        website: null,
        displayUsername: getShortEthAddress(address),
      })}
    >
      <UserProfileInner {...props} />
    </Suspense>
  );
};

const UserProfileInner = async (props: Props) => {
  const { address, children, withPopover, popover, revolutionId } = props;

  const profile = props.profile || (await Profiles().get(address));

  if (withPopover || popover) {
    return (
      <UserProfilePopover revolutionId={revolutionId} profile={profile} content={popover}>
        {children(profile)}
      </UserProfilePopover>
    );
  }

  return children(profile);
};
