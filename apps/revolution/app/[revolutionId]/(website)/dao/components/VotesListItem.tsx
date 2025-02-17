import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { IProposal, IVote, Serialized } from "@cobuild/database/types";
import { shortenIfEthAddress } from "@cobuild/libs/utils/account";
import Link from "next/link";
import { VotesLabel } from "./VotesLabel";
import { VotesListItemReason } from "./VotesListItemReason";
import { etherscanNetworkUrl, zoraProfileUrl } from "@cobuild/libs/utils/url";

interface Props {
  proposal: Serialized<IProposal, "quorum">;
  vote: IVote;
  revolutionId: string;
}

export async function VotesListItem(props: Props) {
  const { vote, proposal } = props;

  const voteOption = proposal.options.find(({ optionId }) => optionId === vote.optionId);

  return (
    <div className="group/vote">
      <div className="mb-2 flex items-center space-x-1.5 text-sm">
        <Avatar id={vote.voter} imageUrl={vote.profile?.profilePicture} size={24} />
        <Link
          href={zoraProfileUrl(vote.voter as `0x${string}`, 1)}
          className="truncate font-medium hover:underline dark:text-zinc-200"
        >
          {shortenIfEthAddress(vote.profile?.username || vote.voter)}
        </Link>
        <span className="whitespace-nowrap dark:contrast-75" style={{ color: voteOption?.color }}>
          voted {voteOption?.name.toLowerCase()}
        </span>
      </div>

      {parseInt(vote.weight) > 0 && (
        <VotesLabel weight={vote.weight} quorumVotes={proposal.quorum} />
      )}

      {vote.reason && vote.reason.trim().length > 0 && (
        <VotesListItemReason proposal={proposal} vote={vote} />
      )}
    </div>
  );
}
