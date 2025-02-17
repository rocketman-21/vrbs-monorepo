import { IStory } from "@cobuild/database/types";
import DateRelative from "@cobuild/ui/atoms/DateRelative";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import Image from "next/image";
import Link from "next/link";

interface Props {
  story: IStory;
  className?: string;
}

export const StoryItem = (props: Props) => {
  const { story, className = "" } = props;

  return (
    <article className={`flex w-full items-center space-x-4 ${className}`}>
      <Link href={story.url} className="flex shrink-0">
        <Image
          src={story.thumbnailUrl}
          alt={story.title}
          width={320}
          height={180}
          className="aspect-[3/2] w-20 rounded-xl object-cover duration-100 hover:opacity-75 md:w-36"
        />
      </Link>

      <div className="grow">
        <div className="flex items-center justify-between gap-x-2.5 text-xs">
          <span className="text-zinc-500 dark:text-zinc-300">
            <Tooltip subtitle="Last update">
              <DateRelative date={story.updatedAt} />
            </Tooltip>
          </span>
        </div>

        <h3 className="mt-1 font-semibold text-zinc-900 md:text-lg dark:text-zinc-50">
          <Link
            href={story.url}
            className="hover:text-lead-500 dark:hover:text-lead-300 duration-100"
          >
            {story.title}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-500 max-sm:hidden lg:pr-2.5 dark:text-zinc-200">
          {story.description || story.subtitle || story.location}
        </p>
      </div>
    </article>
  );
};
