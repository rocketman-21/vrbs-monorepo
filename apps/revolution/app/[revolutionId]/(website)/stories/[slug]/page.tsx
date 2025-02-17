import { Stories } from "@cobuild/database/models/revolution/stories/Stories";
import DateRelative from "@cobuild/ui/atoms/DateRelative";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { generateTwitterSeoContent } from "app/libs/seo/utils/twitterSeoMetadata";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { StoryAction } from "../components/StoryAction";
import { StoryDescription } from "../components/StoryDescription";
import { StorySidebar } from "../components/StorySidebar";
import { StoryUpdates } from "../components/StoryUpdates";

interface Props {
  params: { slug: string; revolutionId: string };
}

export default async function StoryPage(props: Props) {
  const { slug, revolutionId } = props.params;

  const story = await Stories().findBySlug(slug, revolutionId);
  if (!story) notFound();

  return (
    <main className="mx-auto mt-20 w-full max-w-screen-xl px-4 pb-24 md:mt-32 lg:px-6">
      <header className="flex items-start justify-between space-x-2.5">
        <div className="max-w-screen-lg grow">
          <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-4xl dark:text-white">
            {story.title || "Untitled Impact"}
          </h1>
          <div className="mt-1.5 text-xs text-zinc-800 md:text-sm dark:text-zinc-200">
            <Tooltip subtitle="Last update">
              <DateRelative date={story.updatedAt} />
            </Tooltip>
          </div>
        </div>
        <StoryAction story={story} />
      </header>

      <div className="relative grid grid-cols-1 items-start gap-8 md:grid-cols-5">
        <div className="flex w-full flex-col md:col-span-3">
          <div className="my-6 flex">
            <Image
              src={story.imageUrl}
              alt={story.title}
              width={640}
              height={360}
              className="w-full rounded-xl object-cover shadow shadow-zinc-200 dark:shadow-zinc-950"
            />
          </div>

          {story.body.length > 2 && (
            <section className="col-span-2">
              <h3 className="mb-2 text-sm text-zinc-500 dark:text-zinc-300">About</h3>
              <StoryDescription revolutionId={revolutionId} body={story.body} description="" />
            </section>
          )}

          <StoryUpdates story={story} />
        </div>

        <aside className="pt-5 max-sm:order-first md:sticky md:top-4 md:col-span-2">
          <StorySidebar story={story} />
        </aside>
      </div>
    </main>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug, revolutionId } = props.params;

  const story = await Stories().findBySlug(slug, revolutionId);
  if (!story) notFound();

  const { title, subtitle: description, thumbnailUrl } = story;

  const twitter = generateTwitterSeoContent(
    title,
    description || "",
    undefined,
    undefined,
    thumbnailUrl,
  );

  return {
    title,
    description,
    openGraph: { images: [{ url: thumbnailUrl }] },
    twitter,
  };
}
