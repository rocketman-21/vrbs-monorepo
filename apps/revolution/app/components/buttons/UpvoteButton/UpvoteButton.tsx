import { CultureIndexVersion } from "@cobuild/database/types";
import { abbreviateNumber } from "@cobuild/libs/utils/numbers";
import { OnchainUpvoteButton } from "./OnchainUpvoteButton";
import { UpvoteIcon } from "./UpvoteIcon";

type Props = {
  votesWeight: number;
  revolutionId: string;
  pieceId?: string | null;
  chainId?: number | null;
  contractAddress?: `0x${string}` | null;
  logicContractVersion?: CultureIndexVersion | null;
};

export const UpvoteButton = (props: Props) => {
  const { pieceId, chainId, contractAddress, logicContractVersion, revolutionId, votesWeight } =
    props;

  if (pieceId && chainId && contractAddress && logicContractVersion) {
    return (
      <OnchainUpvoteButton
        pieceId={pieceId}
        chainId={chainId}
        contractAddress={contractAddress}
        logicContractVersion={logicContractVersion}
        votesWeight={votesWeight || 0}
        revolutionId={revolutionId}
      />
    );
  }

  return (
    <button disabled className="flex w-full flex-col items-center duration-150">
      <UpvoteIcon hasUpvoted={false} revolutionId={revolutionId} hasBeenDropped={false} />

      <span className="mt-1 text-[11px] font-medium text-white duration-150 md:text-xs">
        {abbreviateNumber(Math.ceil(votesWeight || 0))}
      </span>
    </button>
  );
};
