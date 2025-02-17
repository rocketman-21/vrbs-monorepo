import { Stories } from "@cobuild/database/models/revolution/stories/Stories";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { EmptyState } from "@cobuild/ui/atoms/EmptyState/EmptyState";
import { Metadata } from "next";
import { CreateStoryButton } from "./components/CreateStoryButton";
import { StoryItem } from "./components/StoryItem";

interface Props {
  params: {
    revolutionId: string;
  };
}

export default async function StoriesPage(props: Props) {
  const { revolutionId } = props.params;

  const stories = await Stories().getForRevolution(revolutionId, 100);

  return (
    <div className="mx-auto mt-20 w-full max-w-3xl px-3 pb-16 lg:mt-28 lg:px-6">
      <div className="flex items-center justify-between">
        <h1 className="dark:text-lead-200 text-3xl font-bold tracking-tight text-black">Stories</h1>
        <CreateStoryButton revolutionId={revolutionId} />
      </div>
      {stories.length > 0 && (
        <div className="divide-lead-100 dark:divide-lead-200 space-y-6 divide-y md:space-y-8">
          {stories.map(story => (
            <StoryItem story={story} key={story.slug} className="pt-6 md:pt-8" />
          ))}
        </div>
      )}
      {stories.length === 0 && (
        <EmptyState className="mt-16" text="Sorry! There aren't any stories currently available" />
      )}
    </div>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { revolutionId } = props.params;
  const { name } = getRevolutionConfig(revolutionId);

  return {
    title: `Stories | ${name}`,
    description: `Read about the creators and initiatives that are part of the revolution. ${name}`,
  };
}
