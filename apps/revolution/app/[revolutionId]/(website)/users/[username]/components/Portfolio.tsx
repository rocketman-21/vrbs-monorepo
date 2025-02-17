import { Stories } from "@cobuild/database/models/revolution/stories/Stories";
import { Button } from "@cobuild/ui/atoms/Button";
import EmptyState from "@cobuild/ui/atoms/EmptyState/EmptyState";
import Skeleton from "@cobuild/ui/atoms/Skeleton";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

interface Props {
  address: `0x${string}`;
  revolutionId: string;
  page: number;
}

const PER_PAGE = 12;

export const Portfolio = async (props: Props) => {
  const { address, revolutionId, page } = props;

  const storiesCount = await Stories().countForUser(revolutionId, address);

  if (storiesCount === 0) {
    return <EmptyState className="col-span-full" text="No impact yet..." />;
  }

  const stories = Stories().getForUser(revolutionId, address, page, PER_PAGE);
  const hasMore = storiesCount > page * PER_PAGE;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <Suspense fallback={<Skeleton count={4} square rounded />}>
        {(await stories).map(story => (
          <Link
            key={story.id}
            href={story.url}
            className="group relative block overflow-hidden rounded-2xl bg-zinc-100"
          >
            <Image
              src={story.thumbnailUrl}
              alt={story.title}
              width={640}
              height={360}
              className="aspect-[3/2] w-full object-cover duration-100 ease-in-out group-hover:scale-110"
            />
            <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-b from-black/0 via-black/25 to-black/70">
              <h2 className="relative m-3.5 text-balance text-sm font-bold tracking-tight text-white">
                {story.title}
              </h2>
            </div>
          </Link>
        ))}
        <div className="col-span-full flex justify-between space-x-2.5">
          <div>
            {page > 1 && (
              <Link href={`?page=${page - 1}`}>
                <Button color="outline">&laquo; Previous</Button>
              </Link>
            )}
          </div>
          <div>
            {hasMore && (
              <Link href={`?page=${page + 1}`}>
                <Button color="outline">Next &raquo;</Button>
              </Link>
            )}
          </div>
        </div>
      </Suspense>
    </div>
  );
};
