import { Label } from "@cobuild/ui/molecules/Label/Label";
import { Votes } from "app/components/Votes";

interface Props {
  weight: string;
  quorumVotes?: bigint;
}

export const VotesLabel = (props: Props) => {
  const { weight, quorumVotes } = props;

  if (!weight) return <></>;

  const quorom = quorumVotes ? (Number(weight) / Number(quorumVotes)) * Number(100) : null;

  return (
    <div className="flex space-x-1">
      <Label>
        <Votes type="auto">{weight}</Votes> VOTES
      </Label>
      {quorom && <Label>{quorom.toFixed(2)}% Quorum</Label>}
    </div>
  );
};
