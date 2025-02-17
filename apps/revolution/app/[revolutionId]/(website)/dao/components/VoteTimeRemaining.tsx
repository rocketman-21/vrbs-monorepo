import "server-only";

import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { Blocks } from "@cobuild/database/models/eth/Blocks";
import { IProposal } from "@cobuild/database/types";
import { calculateProposalDate } from "@cobuild/libs/governance/proposals";
import { timeSince, timeUntil } from "@cobuild/libs/utils/numbers";
import { Votes } from "app/components/Votes";
import pluralize from "pluralize";

interface Props {
  proposal: IProposal;
}

export async function VoteTimeRemaining(props: Props) {
  const { proposal } = props;

  const [blockNumber, quorum] = await Promise.all([
    Blocks().getLatestBlockNumber(proposal.chainId),
    proposal.quorum(),
  ]);

  const { startBlock, endBlock, endDate, startDate } = proposal?.metadata || {};
  const propStartDate =
    startDate || calculateProposalDate(blockNumber, startBlock || 0, proposal.chainId);
  const propEndDate =
    endDate || calculateProposalDate(blockNumber, endBlock || 0, proposal.chainId);

  const startDateLabels = getDateLabels(propStartDate);
  const endDateLabels = getDateLabels(propEndDate);

  const votingEndedBlock = endBlock && endBlock < blockNumber;
  const votingEndedDate = endDate && endDate < new Date();

  //handle block or date
  const votingEndsInDate = !votingEndedDate && startDate && startDate < new Date();
  const votingEndsInBlock = !votingEndedBlock && startBlock && startBlock < blockNumber;

  return (
    <div className="flex shrink-0 grow-0 justify-between space-x-4 max-md:px-2">
      <div>
        {propStartDate > new Date() && (
          <>
            <div className="text-sm text-zinc-500">Voting starts in</div>
            <span className="flex gap-2">
              {startDateLabels.map(({ label, value }) => (
                <span key={label} className="flex flex-col">
                  <h4 className="text-lg font-medium">{value}</h4>
                  <div className="text-sm">{label}</div>
                </span>
              ))}
            </span>
          </>
        )}

        {(votingEndsInDate || votingEndsInBlock) && (
          <>
            <div className="text-sm text-zinc-500">Voting ends in</div>
            <span className="flex gap-2">
              {endDateLabels.map(({ label, value }) => (
                <span key={label} className="flex flex-col">
                  <h4 className="text-lg font-medium">{value}</h4>
                  <div className="text-sm">{label}</div>
                </span>
              ))}
            </span>
          </>
        )}

        {(votingEndedBlock || votingEndedDate) && (
          <>
            <div className="text-sm text-zinc-500">Voting ended</div>
            <h4 className="text-lg font-medium">{timeSince(propEndDate)} ago</h4>
          </>
        )}
      </div>

      {quorum > 0 && <ProposalQuorum quorum={quorum} />}
    </div>
  );
}

const getDateLabels = (date: Date) => {
  const { days: daysUntil, hours: hoursUntil, minutes: minutesUntil } = timeUntil(date);

  return [
    { label: pluralize("day", daysUntil), value: daysUntil },
    { label: pluralize("hour", hoursUntil), value: hoursUntil },
    { label: pluralize("min", minutesUntil), value: minutesUntil },
  ];
};

const ProposalQuorum = ({ quorum }: { quorum: bigint }) => {
  return (
    <div>
      <div className="text-sm text-zinc-500">Quorum</div>
      <Tooltip title="The minimum number of votes required for a proposal to be considered valid.">
        <h4 className="text-lg font-medium">
          <Votes type="auto">{quorum}</Votes> votes
        </h4>
      </Tooltip>
    </div>
  );
};
