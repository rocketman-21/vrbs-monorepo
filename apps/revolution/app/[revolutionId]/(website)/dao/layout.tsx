export const revalidate = 60;

import { Proposals } from "@cobuild/database/models/governance/Proposals";
import { Votes } from "@cobuild/database/models/governance/Votes";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { Drafts } from "@cobuild/database/models/social/Drafts";
import { getUser } from "@cobuild/libs/user/server";
import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";
import { Sidebar } from "./components/Sidebar";

type Props = PropsWithChildren<{ params: { revolutionId: string } }>;

export default async function GovernanceLayout(props: Props) {
  const { revolutionId } = props.params;

  const entityId = (await Revolutions().getById(revolutionId))?.governanceEntityId;
  if (!entityId) notFound();

  const user = await getUser(revolutionId);
  const userVotes = await Votes().findForUser(user, entityId);

  const newestProposalId = await Proposals().getLatestId(revolutionId);
  const newestDraftId = await Drafts().getLatestId(revolutionId);

  const urlPrefix = `/${revolutionId}/dao`;

  return (
    <main className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 max-lg:mt-20 lg:h-screen lg:grid-cols-4 lg:items-end lg:gap-8 lg:overflow-hidden lg:px-6">
      <Sidebar
        revolutionId={revolutionId}
        userVotes={userVotes}
        newestProposalId={newestProposalId}
        newestDraftId={newestDraftId}
        governanceEntityId={entityId}
        urlPrefix={urlPrefix}
      />
      {props.children}
    </main>
  );
}
