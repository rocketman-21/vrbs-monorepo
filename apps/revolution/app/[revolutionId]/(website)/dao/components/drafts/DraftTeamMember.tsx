"use client";

import { etherscanNetworkUrl } from "@cobuild/libs/utils/url";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import TrashIcon from "@cobuild/ui/pixel-icons/Trash";
import { UserProfileClient } from "app/components/user-profile/UserProfileClient";
import { UserProfilePopover } from "app/components/user-profile/UserProfilePopover";
import { useRevolution } from "app/libs/useRevolution";
import Link from "next/link";

type Props = {
  address: `0x${string}`;
  removeable: boolean;
  onRemove: (address: `0x${string}`) => void;
};

export const DraftTeamMember = (props: Props) => {
  const { address, removeable, onRemove } = props;
  const { revolutionId, chainId } = useRevolution();

  return (
    <UserProfileClient address={address}>
      {profile => (
        <div className="flex items-center space-x-1.5">
          <div className="group relative">
            <Avatar id={address} imageUrl={profile.profilePicture} />
            {removeable && (
              <button
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/75 text-white opacity-0 duration-150 group-hover:opacity-100"
                onClick={() => {
                  if (!confirm("Are you sure you want to remove this team member?")) return;
                  onRemove(address);
                }}
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            )}
          </div>
          <UserProfilePopover profile={profile} revolutionId={revolutionId}>
            <Link
              href={etherscanNetworkUrl(profile.address, chainId, "address")}
              className="font-medium hover:underline"
            >
              {profile.displayUsername}
            </Link>
          </UserProfilePopover>
        </div>
      )}
    </UserProfileClient>
  );
};
