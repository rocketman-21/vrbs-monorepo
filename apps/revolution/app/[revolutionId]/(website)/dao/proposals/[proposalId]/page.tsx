import "server-only";

import { EmptyState } from "@cobuild/ui/atoms/EmptyState/EmptyState";
import { Proposals } from "@cobuild/database/models/governance/Proposals";
import { Votes } from "@cobuild/database/models/governance/Votes";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { serialize, serializeSync } from "@cobuild/database/utils";
import { getUser } from "@cobuild/libs/user/server";
import clsx from "classnames";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { refreshProposalStatus } from "onchain-ingestion/functions/governance/refreshProposalStatus";
import { ProposalBody } from "../../components/ProposalBody";
import { IProposalTab, ProposalMobileMenu } from "../../components/ProposalMobileMenu";
import { VoteSearch } from "../../components/VoteSearch";
import { VoteTicker } from "../../components/VoteTicker";
import { VoteTimeRemaining } from "../../components/VoteTimeRemaining";
import { VotesList } from "../../components/VotesList";
import { ProposalActions } from "../components/ProposalActions";

const VoteCaster = dynamic(() => import("../../components/VoteCaster"), { ssr: false });

interface Props {
  params: { revolutionId: string; proposalId?: string | null; hideOnMobile: boolean };
  searchParams?: {
    tab?: IProposalTab;
    option?: string;
    phrase?: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { revolutionId, proposalId } = params;

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution || !revolution.governanceEntityId) return {};

  if (!proposalId) return { title: `${revolution.name} Proposals` };

  const proposal = await Proposals().findById(proposalId, revolution.governanceEntityId);
  if (!proposal) return {};

  const { title, numericId } = proposal;

  return {
    title: `${title} | ${revolution.name} #${numericId}`,
    description: `Read the full proposal by ${proposal.profile?.username}.`,
  };
}

const GovernanceProposalPage = async (props: Props) => {
  const { params, searchParams } = props;
  const { revolutionId, proposalId, hideOnMobile } = params;
  const { tab = "proposal", option, phrase } = searchParams || {};

  if (!proposalId) {
    return (
      <div className="col-span-2 flex h-full items-center justify-center">
        <EmptyState text="There aren't any proposals yet." />
      </div>
    );
  }

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution) notFound();

  const { governanceEntityId: entityId, daoContract } = revolution;

  if (!entityId || !daoContract) notFound();

  const proposal = await Proposals().findById(proposalId, entityId);
  if (!proposal) notFound();

  const { chainId } = proposal;

  await refreshProposalStatus(proposalId, daoContract, entityId, chainId, proposal.type);

  const optionId = option ? proposal.options.find(o => o.name === option)?.optionId : undefined;
  const [votes, user] = await Promise.all([
    Votes().findForProposal(proposalId, entityId, optionId, phrase),
    getUser(revolutionId),
  ]);

  const userVotes = user ? await Votes().findForUser(user, entityId) : [];
  const userVote = userVotes.find(vote => vote.proposalId === proposalId);
  const votingPowerContract = revolution.addresses?.revolutionVotingPower;

  return (
    <>
      <ProposalMobileMenu
        returnUrl={`/${revolutionId}/dao`}
        defaultTab={tab}
        isHidden={hideOnMobile}
      />

      <div
        className={clsx(
          "lg:h-body lg:hide-scrollbar max-lg:px-2 lg:col-span-2 lg:block lg:overflow-y-auto lg:py-8",
          { "max-lg:hidden": hideOnMobile || tab === "voting" },
        )}
      >
        <ProposalBody proposal={serializeSync(proposal)} tab={tab} revolutionId={revolutionId} />
      </div>

      <div
        className={clsx("lg:h-body max-lg:px-2 lg:block lg:pt-8", {
          "max-lg:hidden": hideOnMobile || tab !== "voting",
        })}
      >
        <div className="flex h-full flex-col space-y-6">
          <VoteTimeRemaining proposal={proposal} />

          {proposal.hasPresetOptions && parseFloat(proposal.totalVotes) > 0 && (
            <VoteTicker
              votesCount={proposal.votesCount}
              options={proposal.options}
              type={proposal.type}
            />
          )}

          <ProposalActions
            chainId={chainId}
            proposalId={proposalId}
            daoContract={daoContract}
            votingPowerContract={votingPowerContract}
            status={proposal.status}
          />

          <div className="bg-card flex h-full flex-col overflow-hidden rounded-2xl p-5">
            <div className="mb-4 flex items-center justify-between space-x-2">
              <VoteSearch />
            </div>
            <VotesList
              votes={votes}
              proposal={await serialize(proposal, ["quorum"])}
              revolutionId={revolutionId}
            />
          </div>

          {proposal.status === "active" && daoContract && (
            <VoteCaster
              trackerType={revolution.governanceTrackerType}
              proposal={serializeSync(proposal)}
              daoContract={daoContract}
              revolutionId={revolutionId}
              userVote={userVote}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default GovernanceProposalPage;
