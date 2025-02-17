"use client";

import { CultureIndexVersion } from "@cobuild/database/types";
import { Button } from "@cobuild/ui/atoms/Button";
import { Votes } from "app/components/Votes";
import { VotingPowerIcon } from "app/components/VotingPowerIcon";
import { useOnchainUpvote } from "app/components/buttons/UpvoteButton/useOnchainUpvote";
import { useRouter } from "next/navigation";

type Props = {
  pieceId: string;
  chainId: number;
  contractAddress: `0x${string}`;
  logicContractVersion: CultureIndexVersion;
  initialVotesWeight: number;
  onVote?: () => void;
};

export const VoteButton = (props: Props) => {
  const { pieceId, chainId, contractAddress, logicContractVersion, initialVotesWeight } = props;

  const router = useRouter();

  const { vote, isLoading, votingPower, canVote, reason, isWaiting, isWriting } = useOnchainUpvote({
    enabled: true,
    pieceId,
    chainId,
    contractAddress,
    logicContractVersion,
    initialVotesWeight,
    onVote: () => {
      router.refresh();
      props.onVote && props.onVote();
    },
  });

  return (
    <div className="flex flex-col">
      <Button
        fullWidth
        onClick={vote}
        disabled={!canVote || isLoading}
        color={canVote ? "primary" : "outline"}
        pulse={isWaiting || isWriting}
      >
        Vote{" "}
        {votingPower > 0 && (
          <>
            with <VotingPowerIcon className="ml-2 mr-1 h-3.5" /> <Votes>{votingPower}</Votes>
          </>
        )}
      </Button>

      <p className="mt-1.5 text-pretty text-center text-xs text-zinc-500">{reason}</p>
    </div>
  );
};
