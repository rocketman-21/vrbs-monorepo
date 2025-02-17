import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { Metadata } from "next";
import { DropAddButton } from "./components/DropAddButton";
import { DropsGrid } from "./components/DropsGrid";

interface Props {
  params: {
    revolutionId: string;
  };
  searchParams: { page?: string };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { revolutionId } = props.params;
  const { name } = getRevolutionConfig(revolutionId);

  return {
    title: `Impact | ${name}`,
    description: `See the impact made by ${name} on the world.`,
  };
}

export default async function ImpactPage(props: Props) {
  const { searchParams, params } = props;
  const { revolutionId } = params;

  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution) throw new Error(`Revolution not found`);

  return (
    <section className="mt-16 min-h-96 max-w-screen-2xl px-4 py-12 lg:mt-20 lg:px-6">
      <h2 className="mb-2.5 text-3xl font-bold tracking-tight text-zinc-950 lg:text-4xl dark:text-zinc-50">
        Community Impact
      </h2>
      <p className="max-w-screen-md text-balance text-zinc-600 dark:text-zinc-300">
        Impact made by {revolution.name} people around the world. Mint our impact to support
        builders in our movement.
      </p>

      {revolution.farcasterChannelId && (
        <div className="mb-8 mt-6">
          <DropAddButton revolutionId={revolutionId} channelId={revolution.farcasterChannelId} />
        </div>
      )}

      <DropsGrid revolution={revolution} page={page} />
    </section>
  );
}
