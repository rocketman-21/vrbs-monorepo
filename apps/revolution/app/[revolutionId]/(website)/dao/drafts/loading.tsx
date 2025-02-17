import { ProposalBodySkeleton } from "../components/ProposalBodySkeleton";
import { VotingViewSkeleton } from "../components/VotingViewSkeleton";

export default function DraftPageSkeleton() {
  return (
    <>
      <div className="lg:h-body lg:hide-scrollbar py-4 max-lg:px-2 lg:col-span-2 lg:overflow-y-auto lg:py-8">
        <ProposalBodySkeleton />
      </div>
      <div className="lg:h-body pt-8 max-lg:px-2">
        <VotingViewSkeleton />
      </div>
    </>
  );
}
