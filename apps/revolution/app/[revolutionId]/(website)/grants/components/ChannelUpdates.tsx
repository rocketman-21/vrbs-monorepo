import "server-only";

import { getChannelCasts } from "@cobuild/libs/farcaster/getCasts";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { Button } from "@cobuild/ui/atoms/Button";
import { Cast } from "app/components/farcaster/Cast";
import { BuilderBanner } from "../../auction/components/BuilderBanner";
import { getUser } from "@cobuild/libs/user/server";

interface Props {
  revolutionId: string;
  channelId: string;
}

export const ChannelUpdates = async (props: Props) => {
  const { revolutionId, channelId } = props;

  const casts = await getChannelCasts(channelId);
  if (casts.length === 0) return null;

  // If there are casts from 3 days ago with more than 10 likes, use those for trending
  const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
  const recentCasts = casts.filter(
    cast => new Date(cast.timestamp).getTime() >= threeDaysAgo && cast.reactions.likes_count > 10,
  );
  const trending = (recentCasts.length >= 3 ? recentCasts : casts)
    .sort(
      (a, b) =>
        b.reactions.likes_count +
        b.reactions.recasts_count -
        a.reactions.likes_count -
        a.reactions.recasts_count,
    )
    .slice(0, 3);

  const recent = [...casts]
    .filter(c => !trending.some(t => t.hash === c.hash)) // exclude trending
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .slice(0, 8);

  const { name } = getRevolutionConfig(revolutionId);

  const user = await getUser(revolutionId);

  return (
    <section className="bg-lead-50 rounded-2xl pb-24 pt-16 dark:bg-zinc-800">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="text-lead-900 text-center text-3xl font-bold tracking-tight sm:text-4xl dark:text-zinc-100">
          What's happening?
        </h2>
        <p className="text-lead-800 mb-6 mt-1.5 text-center dark:text-zinc-300">
          Latest updates from the {name} community.
        </p>

        {user && <BuilderBanner user={user} revolutionId={revolutionId} />}

        <div className="mt-6 sm:columns-3 sm:gap-6">
          {trending.map(cast => (
            <Cast cast={cast} key={cast.hash} className="mb-3" />
          ))}
          {recent.map(cast => (
            <Cast cast={cast} key={cast.hash} className="mb-3" />
          ))}
        </div>
        <div className="mt-12 text-center">
          <a href={`https://warpcast.com/~/channel/${channelId}`} target="_blank">
            <Button size="lg" color="outline">
              View all updates
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};
