import { ISubmission, Serialized } from "@cobuild/database/types";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import OffchainIcon from "@cobuild/ui/pixel-icons/Power";
import clsx from "classnames";
import { useSponsorCreation } from "./useSponsorCreation";
import { useRevolution } from "app/libs/useRevolution";

interface Props {
  submission: Serialized<ISubmission>;
}

export const SponsorCreationButton = (props: Props) => {
  const { submission } = props;
  const { cultureIndex } = useRevolution();

  const { sponsorPiece, status } = useSponsorCreation(
    submission,
    submission.contractAddress || cultureIndex?.address || `0x`,
  );

  return (
    <Tooltip title="Sponsor onchain" subtitle="Bring this piece onchain and earn rewards">
      <button
        disabled={status !== "idle"}
        onClick={() => sponsorPiece()}
        className={clsx("flex w-full flex-col items-center justify-center", {
          "animate-pulse": status !== "idle",
        })}
      >
        <OffchainIcon className="size-4 md:size-5" />
        <span className="mt-1 text-[11px] font-medium max-sm:hidden md:text-xs">Offchain</span>
      </button>
    </Tooltip>
  );
};
