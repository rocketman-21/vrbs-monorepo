import "server-only";

import { Submissions } from "@cobuild/database/models/revolution/submissions/Submissions";
import { serialize, serializeSync } from "@cobuild/database/utils";
import { isAdmin } from "@cobuild/libs/revolution/admin";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { getUser } from "@cobuild/libs/user/server";
import { DiscussionClient } from "app/components/Discussion/DiscussionClient";
import { CreationItemBackground } from "app/components/creations/CreationItem/CreationItemBackground";
import { getSubmissionSeo } from "app/libs/seo/submissionSeo";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CreationItem } from "../../../../components/creations/CreationItem/CreationItem";
import { ArtRace } from "./components/ArtRace";
import { Details } from "./components/Details";
import { Flagged } from "./components/Flagged";
import { Sponsor } from "./components/Sponsor";
import { Voters } from "./components/Voters";

interface Props {
  params: { slug: string; revolutionId: string };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const submission = await Submissions().findBySlug(params.slug);
  if (!submission) return notFound();

  return getSubmissionSeo(await serialize(submission, ["creatorProfiles"]), params.revolutionId);
}

export default async function CreationPage({ params }: Props) {
  const { slug, revolutionId } = params;

  const submission = await Submissions().findBySlug(slug);
  if (!submission) return notFound();

  const {
    thumbnailUrl,
    votesWeight,
    contractAddress,
    isHidden,
    isOnchain,
    creators,
    onchainSlug,
    sponsorAddress,
  } = submission;

  const { darkMode } = getRevolutionConfig(revolutionId);

  const user = await getUser(revolutionId);
  const isCreator = !!user && creators.some(c => c.address === user);
  const canManage = !!user && (isAdmin(user, revolutionId) || isCreator);
  const isSponsor = !!sponsorAddress && sponsorAddress === user;

  return (
    <main className="relative mx-auto mb-12 grid w-full max-w-screen-2xl grid-cols-1 max-lg:mt-20 max-sm:gap-4 lg:mt-24 lg:grid-cols-3 lg:items-start lg:px-6">
      <section className="lg:h-body relative flex items-center justify-center overflow-hidden rounded-lg max-sm:mx-1.5 lg:sticky lg:top-[40px] lg:col-span-2 lg:rounded-2xl">
        {thumbnailUrl && <CreationItemBackground thumbnailUrl={thumbnailUrl} darkMode={darkMode} />}

        <CreationItem
          submission={await serialize(submission, ["creatorProfiles"])}
          className="max-h-[80vh]"
        />
      </section>

      <section className="bg-page z-[5] flex flex-col space-y-4 max-sm:px-1.5 max-sm:pb-2.5 lg:space-y-6 lg:pl-6">
        <Details submission={submission} revolutionId={revolutionId} canManage={canManage} />

        {isHidden && <Flagged />}

        {!isHidden && isOnchain && (
          <ArtRace canResponsor={isSponsor || canManage} submission={serializeSync(submission)} />
        )}

        {!isHidden && (!isOnchain || onchainSlug) && (
          <Sponsor submission={serializeSync(submission)} revolutionId={revolutionId} />
        )}

        {votesWeight > 0 && <Voters submission={submission} revolutionId={revolutionId} />}

        <div className="bg-card rounded-2xl p-5">
          <h3 className="mb-4 font-semibold">Discussion</h3>
          <DiscussionClient scope={{ id: submission.slug, type: "submission" }} variant="compact" />
        </div>
      </section>
    </main>
  );
}
