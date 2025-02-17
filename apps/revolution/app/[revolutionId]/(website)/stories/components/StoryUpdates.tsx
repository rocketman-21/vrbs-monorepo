import { IStory } from "@cobuild/database/types";
import { getAbsoluteUrl } from "@cobuild/libs/utils/url";
import EmptyState from "@cobuild/ui/atoms/EmptyState/EmptyState";
import Skeleton from "@cobuild/ui/atoms/Skeleton";
import { Cast } from "app/components/farcaster/Cast";
import { Suspense } from "react";
import { PostUpdateButton } from "./PostUpdateButton";

interface Props {
  story: IStory;
}

export const StoryUpdates = async (props: Props) => {
  const { story } = props;

  const updates = story.updates();

  return (
    <>
      <div className="flex items-center justify-between space-x-2">
        <h2 className="font-semibold">Updates</h2>
        <PostUpdateButton url={getAbsoluteUrl(story.url)} slug={story.slug} />
      </div>
      <div className="mt-6 space-y-4">
        <Suspense fallback={<Skeleton height={80} count={3} />}>
          {(await updates).length === 0 ? (
            <EmptyState text="There are no updates yet..." />
          ) : (
            (await updates).map(cast => <Cast cast={cast} key={cast.hash} />)
          )}
        </Suspense>
      </div>
    </>
  );
};
