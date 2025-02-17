import { Grants } from "@cobuild/database/models/revolution/grants/Grants";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { IStory } from "@cobuild/database/types";
import { getUser } from "@cobuild/libs/user/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StoryDescription } from "./StoryDescription";
import { StoryTeam } from "./team/StoryTeam";

interface Props {
  story: IStory;
}

export const StorySidebar = async (props: Props) => {
  const { story } = props;
  const { slug, team, revolutionId, contributors, externalUrl, description, body, alloProfileId } =
    story;

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution) notFound();

  const user = await getUser(revolutionId);
  const canEdit = !!user && story.canBeEditedBy(user);

  const grant = alloProfileId ? await Grants().getById(alloProfileId, revolution.chainId) : null;

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6">
      <section>
        <h3 className="mb-2 text-sm text-zinc-500 dark:text-zinc-300">Team</h3>
        <StoryTeam
          slug={slug}
          team={team.map(address => ({ address }))}
          revolutionId={revolutionId}
          canEdit={canEdit}
        />
      </section>

      {grant && (
        <section>
          <h3 className="mb-2 text-sm text-zinc-500 dark:text-zinc-300">Grant</h3>
          <Link
            href={grant.url}
            className="text-lead-600 hover:text-lead-500 dark:text-lead-300 hover:dark:text-lead-200 text-sm font-medium duration-100 ease-in-out"
          >
            {grant.title}
          </Link>
        </section>
      )}

      {((contributors && contributors.length > 0) || canEdit) && (
        <section className="col-span-2">
          <h3 className="mb-2 text-sm text-zinc-500 dark:text-zinc-300">Contributors</h3>
          <StoryTeam
            slug={slug}
            team={contributors}
            revolutionId={revolutionId}
            canEdit={canEdit}
            isContributor
          />
        </section>
      )}

      {externalUrl && (
        <section className="col-span-2">
          <h3 className="mb-2 text-sm text-zinc-500 dark:text-zinc-300">Website</h3>
          <a
            href={externalUrl}
            target="_blank"
            className="text-lead-600 hover:text-lead-500 dark:text-lead-300 hover:dark:text-lead-200 inline-block max-w-full truncate text-sm font-medium tracking-tight duration-100"
          >
            {externalUrl}
          </a>
        </section>
      )}

      {description && (
        <section className="col-span-2">
          <h3 className="mb-2 text-sm text-zinc-500 dark:text-zinc-300">About</h3>
          <StoryDescription revolutionId={revolutionId} body={body} description={description} />
        </section>
      )}
    </div>
  );
};
