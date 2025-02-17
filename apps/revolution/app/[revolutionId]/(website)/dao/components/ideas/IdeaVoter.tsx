import "server-only";

import { shortenIfEthAddress } from "@cobuild/libs/utils/account";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { UserProfile } from "app/components/user-profile/UserProfile";
import clsx from "classnames";
import pluralize from "pluralize";

type Props = {
  address: `0x${string}`;
  revolutionId: string;
  highlightAddress?: string | null;
  votes?: number;
};

export const IdeaVoter = async (props: Props) => {
  const { address, votes, highlightAddress, revolutionId } = props;

  return (
    <UserProfile address={address} revolutionId={revolutionId} withPopover>
      {({ profilePicture, displayUsername }) => (
        <div className="flex items-center space-x-3">
          <Avatar
            id={address}
            imageUrl={profilePicture}
            className={clsx("opacity-100 duration-150", {
              "ring-lead-300 ring-2": highlightAddress === address,
            })}
            size="28"
          />
          <div className="flex flex-col">
            <div className="dark:hover:text-lead-300 hover:text-lead-500 text-[13px] font-semibold leading-none">
              {shortenIfEthAddress(displayUsername || address)}
            </div>
            {votes && (
              <span className="mt-0.5 text-xs text-zinc-500">
                {Math.round(votes)} {pluralize("vote", votes)}
              </span>
            )}
          </div>
        </div>
      )}
    </UserProfile>
  );
};
