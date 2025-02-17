"use client";

import { getErrorMessage } from "@cobuild/libs/utils/error";
import { normalizeEthAddressOrEnsName } from "@cobuild/libs/web3/ens";
import { useState } from "react";
import { Button } from "@cobuild/ui/atoms/Button";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { DraftTeamMember } from "./DraftTeamMember";

type Props = {
  team: `0x${string}`[];
  editable: boolean;
  onUpdate: (team: string[]) => void;
  protect?: string;
};

export const DraftTeam = (props: Props) => {
  const { editable, onUpdate, protect } = props;
  const [team, setTeam] = useState(props.team);

  const addTeamMember = (address: `0x${string}`) => {
    updateTeam([...team, address]);
  };

  const removeTeamMember = (address: `0x${string}`) => {
    updateTeam(team.filter(member => member !== address));
  };

  const updateTeam = (newTeam: `0x${string}`[]) => {
    setTeam(newTeam);
    onUpdate(newTeam);
  };

  if ((!team || team.length === 0) && !editable) return;

  return (
    <>
      {team.map(address => (
        <DraftTeamMember
          key={address}
          address={address}
          removeable={editable && address !== protect}
          onRemove={removeTeamMember}
        />
      ))}
      {editable && (
        <Button
          type="button"
          color="transparent"
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
          + Add contributor
        </Button>
      )}
    </>
  );
};
