import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { Drafts } from "@cobuild/database/models/social/Drafts";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import GovernanceDraftPage from "./[draftId]/page";

export const revalidate = 120;
export const maxDuration = 300;

interface Props {
  params: { revolutionId: string };
  searchParams?: any;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const revolution = await Revolutions().getById(params.revolutionId);
  if (!revolution) notFound();
  return { title: `${revolution.name} Drafts` };
}

const DraftsPage = async (props: Props) => {
  const { revolutionId } = props.params;

  const entityId = (await Revolutions().getById(revolutionId))?.governanceEntityId;
  if (!entityId) notFound();

  const draftId = await Drafts().getLatestId(revolutionId);

  return (
    <GovernanceDraftPage
      searchParams={props.searchParams}
      params={{ revolutionId, draftId, hideOnMobile: true }}
    />
  );
};

export default DraftsPage;
