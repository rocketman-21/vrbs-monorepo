import "server-only";

import { IGrant } from "@cobuild/database/types";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import Anchor from "@cobuild/ui/pixel-icons/Anchor";
import { UserProfile } from "app/components/user-profile/UserProfile";
import Link from "next/link";
import pluralize from "pluralize";

interface Props {
  grant: IGrant;
}

export const GrantTeam = (props: Props) => {
  const { grant } = props;
  const { isOpenGrantPool, team, revolutionId, alloProfile } = grant;

  return (
    <div>
      <h3 className="font-medium">
        {isOpenGrantPool ? `${pluralize("Point", team.length)} of contact` : "Team"}
      </h3>
      <div className="mt-2.5 flex flex-wrap gap-2 lg:pr-6">
        {team.map(address => (
          <UserProfile address={address} key={address} revolutionId={revolutionId} withPopover>
            {({ username, profilePicture, displayUsername }) => (
              <Link
                href={`/${revolutionId}/users/${username}`}
                className="flex items-center space-x-1.5 rounded-xl border border-zinc-300 p-2"
              >
                <Avatar id={address} size={24} imageUrl={profilePicture} />
                <div className="flex max-w-full space-x-2 truncate">
                  <div className="hover:text-lead-600 text-sm font-medium tracking-tight text-zinc-700">
                    {displayUsername}
                  </div>
                  {alloProfile.owner.toLowerCase() === address.toLowerCase() && (
                    <div className="bg-lead-200 group flex items-center space-x-1.5 rounded-full px-2">
                      <Tooltip subtitle="Owner">
                        <Anchor className="size-3.5" />
                      </Tooltip>
                    </div>
                  )}
                </div>
              </Link>
            )}
          </UserProfile>
        ))}
      </div>
    </div>
  );
};
