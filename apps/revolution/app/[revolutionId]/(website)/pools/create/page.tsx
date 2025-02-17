import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { getUser } from "@cobuild/libs/user/server";
import { Metadata } from "next";
import { PoolCreateForm } from "./components/PoolCreateForm";

interface Props {
  params: {
    revolutionId: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { revolutionId } = params;
  const { name } = getRevolutionConfig(revolutionId);

  return {
    title: `Create a funding pool | ${name}`,
    description: "Describe your initiative and let the community's votes bring your pool to life.",
  };
}

export default async function GrantApplyPage(props: Props) {
  const { revolutionId } = props.params;

  const user = await getUser(revolutionId);

  return (
    <main className="mt-24 md:mt-28">
      <section className="mx-auto max-w-5xl px-4 lg:mt-8 lg:px-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Create a funding pool
          </h2>
          <p className="mt-6 leading-8 text-zinc-500 lg:text-lg">
            Ready to make an impact? Describe what we should fund and why.
          </p>
        </div>
      </section>
      <section className="my-12 bg-zinc-50 py-12">
        <div className="mx-auto max-w-5xl px-4 lg:px-6">
          {!user && (
            <div className="mb-8 flex items-center text-sm text-red-600">
              Please sign in first in order to fill the form.
            </div>
          )}

          <PoolCreateForm revolutionId={revolutionId} user={user} />
        </div>
      </section>
    </main>
  );
}
