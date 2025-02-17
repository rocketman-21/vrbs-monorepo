import { UserProfile } from "app/components/user-profile/UserProfile";
import Link from "next/link";
import { StoryTeamMemberRemove } from "./StoryTeamMembeRemove";

interface Props {
  slug: string;
  address: `0x${string}`;
  revolutionId: string;
  removeable: boolean;
  isContributor: boolean;
  comment?: string;
}

export const StoryTeamMember = (props: Props) => {
  const { address, comment, revolutionId, slug, removeable = false, isContributor } = props;

  return (
    <UserProfile address={address} revolutionId={revolutionId}>
      {profile => (
        <div className="flex items-start gap-x-1.5">
          <StoryTeamMemberRemove
            profile={profile}
            removeable={removeable}
            slug={slug}
            isContributor={isContributor}
          />
          <div className="flex flex-col items-start pt-[1px]">
            <Link
              href={`/${revolutionId}/users/${profile.username}`}
              className="hover:text-lead-500 dark:hover:text-lead-300 text-sm font-medium duration-100 ease-in-out"
            >
              {profile.displayUsername}
            </Link>
            {comment && (
              <p className="mt-0.5 text-pretty text-xs tracking-tight text-zinc-600 md:pr-12 dark:text-zinc-400">
                {comment}
              </p>
            )}
          </div>
        </div>
      )}
    </UserProfile>
  );
};
