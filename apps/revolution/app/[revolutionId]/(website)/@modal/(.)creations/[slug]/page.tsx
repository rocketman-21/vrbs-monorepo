import "server-only";

import { Submissions } from "@cobuild/database/models/revolution/submissions/Submissions";
import { serialize, serializeSync } from "@cobuild/database/utils";
import { isAdmin } from "@cobuild/libs/revolution/admin";
import { getUser } from "@cobuild/libs/user/server";
import { Modal } from "@cobuild/ui/molecules/Modal/Modal";
import { ArtRace } from "app/[revolutionId]/(website)/creations/[slug]/components/ArtRace";
import { Details } from "app/[revolutionId]/(website)/creations/[slug]/components/Details";
import { Flagged } from "app/[revolutionId]/(website)/creations/[slug]/components/Flagged";
import { Sponsor } from "app/[revolutionId]/(website)/creations/[slug]/components/Sponsor";
import { Voters } from "app/[revolutionId]/(website)/creations/[slug]/components/Voters";
import Discussion from "app/components/Discussion/Discussion";
import { CreationItem } from "app/components/creations/CreationItem/CreationItem";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string; revolutionId: string };
}

export default async function CreationModal({ params }: Props) {
  const { slug, revolutionId } = params;

  const submission = await Submissions().findBySlug(slug);
  if (!submission) notFound();

  const {
    votesWeight,
    contractAddress,
    isHidden,
    isOnchain,
    creators,
    onchainSlug,
    sponsorAddress,
  } = submission;

  const user = await getUser(revolutionId);
  const isCreator = !!user && creators.some(c => c.address === user);
  const canManage = !!user && (isAdmin(user, revolutionId) || isCreator);
  const isSponsor = !!sponsorAddress && sponsorAddress === user;

  return (
    <Modal title={submission.name} width="auto" className="lg:max-w-[90vw]" showCloseButton>
      <section className="relative flex w-full max-w-full flex-col max-lg:space-y-6 lg:w-auto lg:flex-row lg:items-start lg:space-x-6 lg:self-center lg:pr-6">
        <CreationItem
          submission={await serialize(submission, ["creatorProfiles"])}
          className="max-h-[80vh] lg:sticky lg:top-0"
        />
        <div className="flex shrink-0 flex-col space-y-4 lg:w-[400px] lg:space-y-6">
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
            <Discussion scope={{ id: submission.slug, type: "submission" }} variant="compact" />
          </div>
        </div>
      </section>
    </Modal>
  );
}
