import "server-only";

import { ISubmission } from "@cobuild/database/types";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import Skeleton from "@cobuild/ui/atoms/Skeleton";
import Collapsable from "@cobuild/ui/molecules/Collapsable/Collapsable";
import { Votes } from "app/components/Votes";
import { VotingPowerIcon } from "app/components/VotingPowerIcon";
import { UserProfile } from "app/components/user-profile/UserProfile";
import Link from "next/link";
import { Suspense } from "react";

interface Props {
  submission: ISubmission;
  revolutionId: string;
}

export const Voters = async (props: Props) => {
  const { submission, revolutionId } = props;

  if (!submission.isOnchain || submission.isHidden) return null;

  return (
    <div className="bg-card rounded-2xl p-5">
      <h3 className="mb-4 font-semibold">Voters</h3>

      <Suspense
        fallback={
          <div className="flex flex-col space-y-2">
            <Skeleton count={3} rounded />
          </div>
        }
      >
        <Collapsable collapsedHeight="220px">
          <div className="flex flex-col items-start gap-y-4">
            {(await submission.votes()).map(v => (
              <div key={v.voter} className="flex items-center">
                <UserProfile address={v.voter} revolutionId={revolutionId} withPopover>
                  {({ username, profilePicture, displayUsername }) => (
                    <Link
                      href={`/${revolutionId}/users/${username}`}
                      className="flex items-center break-all"
                    >
                      <Avatar id={v.voter} imageUrl={profilePicture} className="mr-1.5" size={20} />
                      <span className="hover:text-lead-500 dark:hover:text-lead-300 break-all text-sm duration-100 ease-in-out">
                        {displayUsername}
                      </span>
                    </Link>
                  )}
                </UserProfile>
                <VotingPowerIcon className="ml-3 mr-[3px] h-2.5 shrink-0 text-zinc-500" />
                <span className="shrink-0 text-xs text-zinc-500">
                  <Votes>{v.weight}</Votes>
                </span>
              </div>
            ))}
          </div>
        </Collapsable>
      </Suspense>
    </div>
  );
};
