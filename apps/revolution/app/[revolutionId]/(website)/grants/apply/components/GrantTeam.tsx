"use client";

import { getErrorMessage } from "@cobuild/libs/utils/error";
import { normalizeEthAddressOrEnsName } from "@cobuild/libs/web3/ens";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { toast } from "@cobuild/ui/organisms/Notifications";
import Plus from "@cobuild/ui/pixel-icons/Plus";
import TrashIcon from "@cobuild/ui/pixel-icons/Trash";
import { UserProfileClient } from "app/components/user-profile/UserProfileClient";
import { useState } from "react";

type Props = {
  user: `0x${string}` | null;
  onChange: (team: `0x${string}`[]) => void;
  label?: string;
};

export const GrantTeam = (props: Props) => {
  const { user, onChange, label = "team member" } = props;
  const [team, setTeam] = useState<`0x${string}`[]>(user ? [user] : []);

  const addTeamMember = (address: `0x${string}`) => updateTeam([...team, address]);

  const removeTeamMember = (address: `0x${string}`) => {
    updateTeam(team.filter(member => member !== address) as `0x${string}`[]);
  };

  const updateTeam = (newTeam: `0x${string}`[]) => {
    setTeam(newTeam);
    onChange(newTeam);
  };

  return (
    <div className="flex flex-wrap items-center gap-6">
      {team.map(address => (
        <UserProfileClient address={address} key={address}>
          {({ profilePicture, displayUsername }) => (
            <div className="flex items-center space-x-2" key={address}>
              <div className="group relative size-6">
                <Avatar id={address} imageUrl={profilePicture} size="32" />
                {address !== user && (
                  <button
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/75 text-white opacity-0 duration-150 group-hover:opacity-100"
                    onClick={() => removeTeamMember(address)}
                  >
                    <TrashIcon className="size-4" />
                  </button>
                )}
              </div>
              <div className="max-sm:text-sm">{displayUsername}</div>
            </div>
          )}
        </UserProfileClient>
      ))}

      <button
        type="button"
        className="hover:text-lead-500 dark:hover:text-lead-100 flex items-center text-sm duration-150"
        onClick={async () => {
          const input = prompt("Enter ETH Address or ENS name") || "";
          if (!input) return;

          try {
            const address = await normalizeEthAddressOrEnsName(input);
            if (team.includes(address)) throw new Error("This user is already in the team");
            addTeamMember(address);
          } catch (error) {
            toast.error(getErrorMessage(error));
          }
        }}
      >
        <Plus className="mr-1 h-4 w-4" /> Add {label}
      </button>
    </div>
  );
};
