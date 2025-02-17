import { ISubmission, Serialized } from "@cobuild/database/types";
import FlagIcon from "@cobuild/ui/pixel-icons/Flag";
import { UpvoteButton } from "app/components/buttons/UpvoteButton/UpvoteButton";
import { SponsorCreationButton } from "../SponsorCreationButton";

interface Props {
  submission: Serialized<ISubmission, "creatorProfiles">;
  revolutionId: string;
}

export const CreationAction = (props: Props) => {
  const { submission, revolutionId } = props;
  const { isHidden, isOnchain, votesWeight } = submission;

  return (
    <div className="flex min-w-8 shrink-0 justify-center">
      {isHidden && (
        <div className="flex w-full flex-col items-center justify-center">
          <FlagIcon className="size-4 md:size-5" />
          <span className="mt-1 text-[11px] font-medium max-sm:hidden md:text-xs">Flagged</span>
        </div>
      )}

      {!isHidden && !isOnchain && <SponsorCreationButton submission={submission} />}

      {!isHidden && isOnchain && (
        <UpvoteButton
          votesWeight={votesWeight}
          revolutionId={revolutionId}
          pieceId={submission.pieceId}
          chainId={submission.chainId}
          contractAddress={submission.contractAddress}
          logicContractVersion={submission.logicContractVersion}
        />
      )}
    </div>
  );
};
