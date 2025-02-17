"use client";

import { ISubmission, Serialized } from "@cobuild/database/types";
import { Button } from "@cobuild/ui/atoms/Button";
import Link from "next/link";
import { SponsorButton } from "./SponsorButton";

interface Props {
  submission: Serialized<ISubmission>;
  revolutionId: string;
}

export const Sponsor = (props: Props) => {
  const { submission, revolutionId } = props;
  const { hasBeenDropped, isOnchain, onchainSlug } = submission;

  return (
    <div className="bg-card rounded-2xl p-5">
      <h3 className="mb-6 text-balance text-lg font-semibold">
        {onchainSlug ? "Offchain piece" : "Sponsor onchain"}
      </h3>

      {!isOnchain && !hasBeenDropped && !onchainSlug && <SponsorButton submission={submission} />}

      {!!onchainSlug && (
        <AlreadySponsoredButton submission={submission} revolutionId={revolutionId} />
      )}
    </div>
  );
};

export const AlreadySponsoredButton = (props: Props) => {
  return (
    <div className="flex flex-col">
      <Link href={`/${props.revolutionId}/creations/${props.submission.onchainSlug}`}>
        <Button fullWidth>View onchain page</Button>
      </Link>

      <p className="mt-1.5 text-pretty text-center text-xs text-zinc-500">
        This art piece was sponsored
      </p>
    </div>
  );
};
