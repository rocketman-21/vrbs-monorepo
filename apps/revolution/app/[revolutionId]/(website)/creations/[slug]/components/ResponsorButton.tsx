"use client";

import { ISubmission, Serialized } from "@cobuild/database/types";
import { Button } from "@cobuild/ui/atoms/Button";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useSponsorCreation } from "app/components/creations/useSponsorCreation";
import { useRevolution } from "app/libs/useRevolution";

type Props = {
  submission: Serialized<ISubmission>;
};

export const ResponsorButton = (props: Props) => {
  const { submission } = props;
  const { cultureIndex } = useRevolution();

  const { responsorPiece, status } = useSponsorCreation(
    submission,
    submission.contractAddress || cultureIndex?.address || `0x`,
  );

  return (
    <div className="mt-2.5 flex flex-col">
      <Button
        fullWidth
        onClick={() => {
          if (
            window.confirm(
              "Are you sure you want to re-sponsor this piece? It cannot be undone. Voting for this piece will be restarted.",
            )
          ) {
            try {
              responsorPiece();
            } catch (error: any) {
              console.error(error);
              toast.error(error.message);
            }
          }
        }}
        disabled={status !== "idle"}
        pulse={status !== "idle"}
        color="outline"
      >
        Re-Sponsor
      </Button>

      <p className="mt-1.5 text-pretty text-center text-xs text-zinc-500">
        Reupload this piece onchain and restart voting
      </p>
    </div>
  );
};
