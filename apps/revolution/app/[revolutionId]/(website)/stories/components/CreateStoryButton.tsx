import "server-only";

import { Grants } from "@cobuild/database/models/revolution/grants/Grants";
import { getUser } from "@cobuild/libs/user/server";
import { Button } from "@cobuild/ui/atoms/Button";
import { ConditionalWrapper } from "@cobuild/ui/atoms/ConditionalWrapper";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { getUserPower } from "app/libs/vote-power";
import Link from "next/link";
import { ComponentProps } from "react";
import { CreateStoryModal } from "./CreateStoryModal";
import { getInitiativesOptions } from "../../grants/components/getInitiativesOptions";

type ButtonProps = ComponentProps<typeof Button>;

interface Props {
  revolutionId: string;
  size?: ButtonProps["size"];
}

export const CreateStoryButton = async (props: Props) => {
  const { revolutionId, size } = props;

  const user = await getUser(revolutionId);
  const userVotingPower = await getUserPower(revolutionId);

  const votesThreshold = 50;
  const canCreateStory = BigInt(userVotingPower.votingPower) > BigInt(votesThreshold * 1e18);

  const initiatives = user ? await getInitiativesOptions(revolutionId) : [];

  return (
    <>
      {user && <CreateStoryModal user={user} initiatives={initiatives} />}
      <Link href="?createStory=true">
        <ConditionalWrapper
          condition={!canCreateStory}
          wrapper={children => (
            <Tooltip subtitle={`You need at least ${votesThreshold} voting power to add a story`}>
              {children}
            </Tooltip>
          )}
        >
          <Button size={size} color="outline" disabled={!canCreateStory}>
            Add story
          </Button>
        </ConditionalWrapper>
      </Link>
    </>
  );
};
