"use client";

import { ISubmission, Serialized } from "@cobuild/database/types";
import { ordinal } from "@cobuild/libs/utils/numbers";
import { useCultureIndex } from "@cobuild/libs/web3/revolution/useCultureIndex";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import SvgTrophy from "@cobuild/ui/pixel-icons/Trophy";
import { Votes } from "app/components/Votes";
import { VotingPowerIcon } from "app/components/VotingPowerIcon";
import { MetaItem } from "./MetaItem";
import { ResponsorButton } from "./ResponsorButton";
import { VoteButton } from "./VoteButton";
import { usePiecePosition } from "./usePiecePosition";
import { isBefore, subDays } from "date-fns";

interface Props {
  submission: Serialized<ISubmission>;
  canResponsor: boolean;
}

const MIN_DAYS_TO_RESPONSOR = 7;
const MIN_POSITION_TO_RESPONSOR = 10;

export const ArtRace = (props: Props) => {
  const { submission, canResponsor } = props;
  const {
    pieceId,
    hasBeenDropped,
    chainId,
    contractAddress,
    logicContractVersion,
    createdAt,
    onchainSlug,
  } = submission;
  const { cultureIndex } = useCultureIndex(contractAddress, chainId);
  const { position, pieceCount, quorum, refetch, votesWeight } = usePiecePosition({
    enabled: !!pieceId && !!contractAddress && !hasBeenDropped,
    pieceId: pieceId ? BigInt(pieceId) : 0n,
    contractAddress,
    chainId,
  });

  if (onchainSlug) return null;

  const resposorAllowed =
    canResponsor &&
    !hasBeenDropped &&
    isBefore(createdAt, subDays(new Date(), MIN_DAYS_TO_RESPONSOR)) &&
    ((position || 0) > MIN_POSITION_TO_RESPONSOR || votesWeight === 0n);

  return (
    <div className="bg-card rounded-2xl p-5">
      <h3 className="text-balance text-lg font-semibold">{cultureIndex?.name || "Art Race"}</h3>

      <div className="mt-4 grid grid-cols-2 gap-x-2.5 md:grid-cols-3">
        <MetaItem label="Votes">
          <div className="flex items-center">
            <VotingPowerIcon className="mr-1.5 size-4 text-zinc-500" />
            <Votes>
              {hasBeenDropped ? submission.votesWeight : votesWeight || submission.votesWeight}
            </Votes>
          </div>
        </MetaItem>

        {pieceId && (quorum || 0) > (submission.votesWeight || 0) && (
          <Tooltip subtitle="Votes needed to be eligible for the auction">
            <MetaItem label="Required">
              <Votes>{quorum || 0}</Votes>
            </MetaItem>
          </Tooltip>
        )}

        {hasBeenDropped && (
          <MetaItem label="Won Art Race">
            <div className="flex items-center space-x-1">
              <SvgTrophy className="mr-1.5 size-4 text-zinc-500" /> Yes
            </div>
          </MetaItem>
        )}

        {!hasBeenDropped && pieceId && position && (
          <MetaItem label="Place">
            <div className="flex items-center">
              {position === 1 && <SvgTrophy className="mr-1.5 size-4 text-zinc-500" />}
              {ordinal(position || 0)} of {pieceCount}
            </div>
          </MetaItem>
        )}
      </div>

      {chainId && contractAddress && logicContractVersion && pieceId && !hasBeenDropped && (
        <div className="mt-6">
          <VoteButton
            chainId={chainId}
            contractAddress={contractAddress}
            logicContractVersion={logicContractVersion}
            initialVotesWeight={submission.votesWeight}
            pieceId={pieceId}
            onVote={refetch}
          />
        </div>
      )}

      {resposorAllowed && <ResponsorButton submission={submission} />}
    </div>
  );
};
