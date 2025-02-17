import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { getUser } from "@cobuild/libs/user/server";
import { Metadata } from "next";
import Link from "next/link";
import { GrantApplyForm } from "./components/GrantApplyForm";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { getRevolutionSocials } from "app/libs/social";
import { notFound } from "next/navigation";

interface Props {
  params: {
    revolutionId: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { revolutionId } = params;
  const { name } = getRevolutionConfig(revolutionId);

  return {
    title: `Apply for a grant | ${name}`,
    description:
      "Describe your initiative and let the community's votes bring your project to life.",
  };
}

export default async function GrantApplyPage(props: Props) {
  const { revolutionId } = props.params;

  const [user, revolution] = await Promise.all([
    getUser(revolutionId),
    Revolutions().getById(revolutionId),
  ]);

  if (!revolution) {
    return notFound();
  }

  const socials = getRevolutionSocials(revolution.socialLinks);

  return (
    <main className="mt-24 md:mt-28">
      <section className="mx-auto max-w-5xl px-4 lg:mt-8 lg:px-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Apply for a grant
          </h2>
          <p className="mt-6 leading-8 text-zinc-500 lg:text-lg">
            Ready to make an impact? Describe your initiative and let the community&apos;s votes
            bring your project to life. Join us in shaping the future!
          </p>
        </div>
        <div className="mt-8 flex flex-col max-md:gap-y-4 md:flex-row md:gap-x-12 lg:mt-10">
          <Link
            href={`/${revolutionId}/grants`}
            className="font-semibold underline-offset-4 hover:underline"
          >
            View examples <span aria-hidden="true">&rarr;</span>
          </Link>
          <a
            href={socials?.[0]?.url || "https://twitter.com/rocketman_w"}
            className="font-semibold underline-offset-4 hover:underline"
            target="_blank"
          >
            Got a question?
          </a>
        </div>
      </section>
      <section className="my-12 bg-zinc-50 py-12">
        <div className="mx-auto max-w-5xl px-4 lg:px-6">
          {!user && (
            <div className="mb-8 flex items-center text-sm text-red-600">
              Please sign in first in order to fill the form.
            </div>
          )}

          <GrantApplyForm revolutionId={revolutionId} user={user} />
        </div>
      </section>
    </main>
  );
}
