import "server-only";

import { Stories } from "@cobuild/database/models/revolution/stories/Stories";
import DateRelative from "@cobuild/ui/atoms/DateRelative";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { Modal } from "@cobuild/ui/molecules/Modal/Modal";
import { StoryAction } from "app/[revolutionId]/(website)/stories/components/StoryAction";
import { StoryDescription } from "app/[revolutionId]/(website)/stories/components/StoryDescription";
import { StorySidebar } from "app/[revolutionId]/(website)/stories/components/StorySidebar";
import { StoryUpdates } from "app/[revolutionId]/(website)/stories/components/StoryUpdates";
import Image from "next/image";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string; revolutionId: string };
}

export default async function StoryModalPage({ params }: Props) {
  const { slug, revolutionId } = params;

  const story = await Stories().findBySlug(slug, revolutionId);
  if (!story) notFound();

  return (
    <Modal title={story.title} width="100%" className="lg:max-w-screen-xl">
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
    </Modal>
  );
}
