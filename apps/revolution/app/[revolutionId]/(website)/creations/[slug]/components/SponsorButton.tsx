"use client";

import { ISubmission, Serialized } from "@cobuild/database/types";
import { Button } from "@cobuild/ui/atoms/Button";
import { MobileConditionalTooltip } from "app/components/MobileConditionalTooltip";
import { useSponsorCreation } from "app/components/creations/useSponsorCreation";
import { useRevolution } from "app/libs/useRevolution";

type Props = {
  submission: Serialized<ISubmission>;
};

export const SponsorButton = (props: Props) => {
  const { submission } = props;
  const { cultureIndex } = useRevolution();

  const { sponsorPiece, status } = useSponsorCreation(
    submission,
    submission.contractAddress || cultureIndex?.address || `0x`,
  );

  return (
    <div className="flex flex-col">
      <Button
        fullWidth
        onClick={() => sponsorPiece()}
        disabled={status !== "idle"}
        pulse={status !== "idle"}
      >
        Sponsor
      </Button>

      <MobileConditionalTooltip subtitle="Earn 0.25% of the winning auction bid">
        <p className="mt-1.5 text-pretty text-center text-xs text-zinc-500">
          Bring this piece onchain and earn rewards
        </p>
      </MobileConditionalTooltip>
    </div>
  );
};
