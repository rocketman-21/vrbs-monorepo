import "server-only";

import { Stories } from "@cobuild/database/models/revolution/stories/Stories";
import { isAdmin } from "@cobuild/libs/revolution/admin";
import { getUser } from "@cobuild/libs/user/server";
import { Button } from "@cobuild/ui/atoms/Button";
import Link from "next/link";
import { CreateStoryButton } from "./CreateStoryButton";
import { StoryCard } from "./StoryCard";

interface Props {
  revolutionId: string;
  count?: number;
}

const stories_enabled = ["vrbs", "grounds", "dfw", "thatsgnarly"];

export const StoriesGrid = async (props: Props) => {
  const { revolutionId, count = 12 } = props;

  if (!stories_enabled.includes(revolutionId)) return null;

  const [stories, user] = await Promise.all([
    Stories().getForRevolution(revolutionId, count),
    getUser(revolutionId),
  ]);

  return (
    <section className="bg-zinc-50 py-16 md:pb-20 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            Stories
          </h2>
          <p className="mt-2 text-base text-zinc-600 md:text-lg dark:text-zinc-400">
            See what people are creating in our community.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
          {stories.map(story => (
            <StoryCard story={story} key={story.slug} />
          ))}
        </div>

        <div className="mt-12 space-x-4 text-center">
          {isAdmin(user, revolutionId) && (
            <CreateStoryButton revolutionId={revolutionId} size="lg" />
          )}
          <Link href={`/${revolutionId}/stories`}>
            <Button size="lg" color="outline">
              View all
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
