import { Proposals } from "@cobuild/database/models/governance/Proposals";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import GovernanceProposalPage from "./[proposalId]/page";

export const revalidate = 120;

interface Props {
  params: { revolutionId: string };
  searchParams?: any;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const revolution = await Revolutions().getById(params.revolutionId);
  if (!revolution) notFound();
  return { title: `${revolution.name} Proposals` };
}

const GovernanceProposalsPage = async (props: Props) => {
  const { revolutionId } = props.params;

  const proposalId = await Proposals().getLatestId(revolutionId);

  return (
    <GovernanceProposalPage
      searchParams={props.searchParams}
      params={{ revolutionId, proposalId, hideOnMobile: true }}
    />
  );
};

export default GovernanceProposalsPage;
