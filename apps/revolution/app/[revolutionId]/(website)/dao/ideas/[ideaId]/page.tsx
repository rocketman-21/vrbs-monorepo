import "server-only";

export const maxDuration = 300;

import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { Ideas } from "@cobuild/database/models/social/Ideas";
import { getUser } from "@cobuild/libs/user/server";
import { shortenIfEthAddress } from "@cobuild/libs/utils/account";
import { canUseNextImage } from "@cobuild/libs/utils/image";
import { truncateString } from "@cobuild/libs/utils/text";
import ArrowDown from "@cobuild/ui/pixel-icons/ArrowDown";
import ArrowUp from "@cobuild/ui/pixel-icons/ArrowUp";
import Discussion from "app/components/Discussion/Discussion";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ConvertIdeaButton } from "../../components/ideas/ConvertIdeaButton";
import { DeleteIdeaButton } from "../../components/ideas/DeleteIdeaButton";
import { IdeaVoter } from "../../components/ideas/IdeaVoter";

interface Props {
  params: { revolutionId: string; ideaId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { revolutionId, ideaId } = params;

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution) notFound();

  const idea = await Ideas().findById(ideaId);
  if (!idea) notFound();

  return {
    title: `${truncateString(idea.body, 80)}`,
    description: `Read more about ${idea.profile?.username || shortenIfEthAddress(idea.creator)}'s idea`,
    openGraph: idea.imageUrl ? { images: [{ url: idea.imageUrl }] } : undefined,
  };
}

export default async function IdeaPage(props: Props) {
  const { ideaId, revolutionId } = props.params;

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution) notFound();

  const idea = await Ideas().findById(ideaId);
  if (!idea) notFound();

  const user = await getUser(revolutionId);

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="bg-card rounded-xl p-5 lg:hidden">
        <div className="flex items-center justify-between space-x-1.5">
          <h3 className="font-semibold">Idea</h3>
          <span className="text-sm text-zinc-500">by {idea.profile?.username}</span>
        </div>
        <p className="mt-4">{idea.body}</p>
      </div>
      {idea.imageUrl && (
        <div className="bg-card rounded-2xl p-5">
          <h3 className="mb-4 font-semibold">{revolution?.aiName}&apos;s Image</h3>
          <a
            href={idea.imageUrl}
            target="_blank"
            rel="noreferrer"
            className="duration-100 hover:opacity-85"
          >
            <Image
              src={idea.imageUrl}
              alt="Idea"
              width={420}
              height={420}
              className="w-full rounded-md"
              unoptimized={!canUseNextImage(idea.imageUrl)}
            />
          </a>
        </div>
      )}
      {idea.upvoters().length > 0 && (
        <div className="bg-card rounded-2xl p-5">
          <h3 className="mb-4 flex items-center font-semibold">
            <ArrowUp className="mr-1.5 h-5 w-5 text-green-400" />
            Upvoters
          </h3>
          <div className="flex flex-col items-start space-y-3">
            {idea.upvoters().map(address => (
              <IdeaVoter
                key={address}
                address={address as `0x${string}`}
                highlightAddress={user}
                revolutionId={revolutionId}
              />
            ))}
          </div>
        </div>
      )}

      {idea.downvoters().length > 0 && (
        <div className="bg-card rounded-2xl p-5">
          <h3 className="mb-4 flex items-center font-semibold">
            <ArrowDown className="mr-1.5 h-5 w-5 text-red-400" />
            Downvoters
          </h3>
          <div className="flex flex-col items-start space-y-3">
            {idea.downvoters().map(address => (
              <IdeaVoter
                key={address}
                address={address as `0x${string}`}
                highlightAddress={user}
                revolutionId={revolutionId}
              />
            ))}
          </div>
        </div>
      )}

      <div className="bg-card rounded-2xl p-5">
        <h3 className="mb-4 font-semibold">Discussion</h3>
        <Discussion scope={{ id: idea.ideaId, type: "idea" }} variant="compact" />
      </div>

      {idea.canBeEditedBy(user) && (
        <div className="flex items-center justify-center space-x-2.5 pb-12">
          <ConvertIdeaButton ideaId={ideaId} revolutionId={revolutionId} />
          <DeleteIdeaButton ideaId={ideaId} revolutionId={revolutionId} />
        </div>
      )}
    </div>
  );
}
