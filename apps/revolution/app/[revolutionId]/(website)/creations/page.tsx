import "server-only";

import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { Submissions } from "@cobuild/database/models/revolution/submissions/Submissions";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { ICreationsFilter } from "@cobuild/libs/revolution/interfaces";
import { getUser } from "@cobuild/libs/user/server";
import { CreationsFilter } from "app/components/creations/CreationsFilter/CreationsFilter";
import { CreationsGrid } from "app/components/creations/CreationsGrid/CreationsGrid";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { CreationsSidebar } from "./components/CreationsSidebar";

const CreateFloatingButton = dynamic(
  () => import("app/components/creations/CreateFloatingButton"),
  {
    ssr: false,
  },
);

interface Props {
  searchParams?: {
    filter?: ICreationsFilter;
    creator?: string;
  };
  params: {
    revolutionId: string;
  };
}

export default async function CreationsPage(props: Props) {
  const { revolutionId } = props.params;
  const { filter = "next-up", creator } = props.searchParams || {};

  const [revolution, user] = await Promise.all([
    Revolutions().getById(revolutionId),
    getUser(revolutionId),
  ]);

  if (!revolution) return notFound();
  const { addresses } = revolution;

  if (!addresses?.cultureIndex) {
    return <div>Missing Culture Index contract...</div>;
  }

  const userCount = await Submissions().countByCreator(user, addresses?.cultureIndex || null);

  return (
    <div className="relative mx-auto w-full max-w-screen-2xl lg:grid lg:grid-cols-5 lg:gap-6 lg:px-6">
      <CreationsSidebar userHasSubmissions={userCount > 0} filter={filter} />
      <div className="relative mt-20 w-full pb-6 max-sm:px-1 lg:col-span-4 lg:mt-24">
        <CreationsGrid
          contractAddress={addresses.cultureIndex}
          filter={filter}
          creatorAddress={creator}
        />
      </div>
      <div className="fixed bottom-20 left-4 z-30 lg:hidden">
        <CreationsFilter revolutionId={revolutionId} />
      </div>
      <div className="fixed bottom-6 left-4 z-30 lg:hidden">
        <CreateFloatingButton filter={filter} modal="create" />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hashtag, defaultSeo } = getRevolutionConfig(params.revolutionId);

  const revolution = await Revolutions().getById(params.revolutionId);

  return {
    title: revolution?.cultureIndex?.name || `Creations | #${hashtag}`,
    description: revolution?.cultureIndex?.description || defaultSeo.description,
  };
}
