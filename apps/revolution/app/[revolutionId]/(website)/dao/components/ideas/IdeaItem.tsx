import "server-only";

import { Ideas } from "@cobuild/database/models/social/Ideas";
import { Idea } from "@cobuild/database/types";
import { canUseNextImage } from "@cobuild/libs/utils/image";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { DateRelative } from "@cobuild/ui/atoms/DateRelative";
import ChevronDown from "@cobuild/ui/pixel-icons/ChevronDown";
import ChevronUp from "@cobuild/ui/pixel-icons/ChevronUp";
import Comment from "@cobuild/ui/pixel-icons/Comment";
import { UserProfile } from "app/components/user-profile/UserProfile";
import clsx from "classnames";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { IdeaItemCard } from "./IdeaItemCard";

interface Props {
  idea: Idea;
  user: `0x${string}` | null;
  revolutionId: string;
}

export const IdeaItem = async (props: Props) => {
  const { idea, user, revolutionId } = props;

  async function upvoteIdea() {
    "use server";
    if (!user) return;
    await Ideas().upvote(idea.ideaId, user, revolutionId);
    revalidatePath(`/${revolutionId}/dao/ideas`);
    revalidatePath(`/${revolutionId}/dao/ideas/${idea.ideaId}`);
  }

  async function downvoteIdea() {
    "use server";
    if (!user) return;
    await Ideas().downvote(idea.ideaId, user, revolutionId);
    revalidatePath(`/${revolutionId}/dao/ideas`);
    revalidatePath(`/${revolutionId}/dao/ideas/${idea.ideaId}`);
  }

  const userVote = idea.voteOf(user);

  return (
    <IdeaItemCard ideaId={idea.ideaId}>
      <aside className="relative flex shrink-0 flex-col items-center p-3 lg:p-4">
        <form action={upvoteIdea}>
          <button
            className={clsx("duration-150", {
              "text-green-400": userVote === 1,
              "hover:text-lead-500 dark:hover:text-lead-300": !!user,
            })}
            type="submit"
            disabled={!user}
          >
            <ChevronUp className="h-6 w-6" />
          </button>
        </form>
        <strong className="mb-1 min-w-[24px] text-center font-semibold tabular-nums leading-none">
          {idea.voteResult}
        </strong>
        <form action={downvoteIdea}>
          <button
            className={clsx("duration-150", {
              "text-red-400": userVote === -1,
              "hover:text-lead-500 dark:hover:text-lead-300": !!user,
            })}
            type="submit"
            disabled={!user}
          >
            <ChevronDown className="h-6 w-6" />
          </button>
        </form>
      </aside>

      <div className="flex grow flex-col justify-between p-3 !pl-0 lg:p-4">
        <main>
          <h3 className="hover:text-lead-500 dark:hover:text-lead-200 pr-2.5 font-medium duration-150 max-lg:text-[15px]">
            <Link href={`/${revolutionId}/dao/ideas/${idea.ideaId}`}>{idea.body}</Link>
          </h3>
        </main>

        <footer className="mt-2.5 flex items-center space-x-2 text-[13px] text-zinc-500 dark:text-zinc-400">
          <UserProfile
            withPopover
            profile={idea.profile}
            address={idea.creator}
            revolutionId={revolutionId}
          >
            {profile => (
              <div className="flex items-center space-x-1.5">
                <Avatar id={profile.address} imageUrl={profile.profilePicture} size={18} />
                <span>{profile.displayUsername}</span>
              </div>
            )}
          </UserProfile>
          <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
            <circle cx={1} cy={1} r={1} />
          </svg>
          <DateRelative date={idea.createdAt} />
          <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
            <circle cx={1} cy={1} r={1} />
          </svg>
          <div className="flex items-center">
            <Comment className="mr-1.5 h-3 w-3" />
            {idea.commentsCount}
          </div>
        </footer>
      </div>
      {idea.imageUrl && (
        <div className="shrink-0 px-2.5 max-sm:hidden">
          <Image
            src={idea.imageUrl}
            alt="Idea"
            width={64}
            height={64}
            className="size-16 rounded-md"
            unoptimized={!canUseNextImage(idea.imageUrl)}
          />
        </div>
      )}
    </IdeaItemCard>
  );
};
