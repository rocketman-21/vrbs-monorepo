import { IStory } from "@cobuild/database/types";
import DateRelative from "@cobuild/ui/atoms/DateRelative";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import Image from "next/image";
import Link from "next/link";

interface Props {
  story: IStory;
}

export const StoryCard = (props: Props) => {
  const { story } = props;

  return (
    <article>
      <div className="relative overflow-hidden rounded-2xl shadow shadow-zinc-200 dark:shadow-zinc-800">
        <Link href={story.url}>
          <Image
            src={story.thumbnailUrl}
            alt={story.title}
            width={640}
            height={360}
            className="aspect-[5/3] w-full rounded-2xl bg-zinc-100 object-cover duration-150 ease-in-out hover:scale-110"
          />
        </Link>
      </div>
      <div className="mt-4 flex items-center justify-between gap-x-2.5 text-xs">
        <span className="text-zinc-800 dark:text-zinc-400">
          <Tooltip subtitle="Last update">
            <DateRelative date={story.updatedAt} />
          </Tooltip>
        </span>
      </div>
      <div className="group relative">
        <h3 className="group-hover:text-lead-600 dark:group-hover:text-lead-300 mt-2 text-lg font-semibold leading-tight text-zinc-900 duration-100 ease-in-out dark:text-zinc-50">
          <Link href={story.url}>
            <span className="absolute inset-0" />
            {story.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
          {story.description}
        </p>
      </div>
    </article>
  );
};
