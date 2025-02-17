"use client";

import { useUser } from "@cobuild/libs/hooks/useUser";
import { Button } from "@cobuild/ui/atoms/Button";
import { Votes } from "app/components/Votes";
import Link from "next/link";
import { UserVoteStatus } from "./useGrantsVote";

interface Props {
  status: UserVoteStatus;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

export const SubgrantsListCta = (props: Props) => {
  const { status, isEditing, setIsEditing } = props;

  const { login, votingPower } = useUser();

  if (status === "guest") {
    return (
      <div className="text-sm">
        <button className="underline" onClick={() => login()}>
          Sign in
        </button>{" "}
        to cast your votes.
      </div>
    );
  }

  if (status === "cant-vote") {
    return (
      <div className="text-sm">
        You don&apos;t have any votes.{" "}
        <Link href="/" className="underline">
          Bid on auction
        </Link>
        .
      </div>
    );
  }

  if (status === "voted") {
    return (
      <div className="border-lead-500 max-w-md rounded-xl border p-3 sm:p-5">
        <h3 className="text-xl font-bold">Votes allocated.</h3>
        <p className="mt-2.5 text-base text-zinc-600">
          You allocated all of your <Votes>{votingPower}</Votes> votes.
          <br /> Thanks, your voice matters!
        </p>
        <div className="mt-6 flex items-center space-x-4">
          <Button
            size="base"
            disabled={isEditing}
            color="outline"
            onClick={() => setIsEditing(true)}
          >
            {!isEditing && "Edit votes"}
            {isEditing && "Voting in progress..."}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-lead-500 max-w-md rounded-xl border-4 border-dashed p-5">
      <h3 className="text-xl font-bold">
        Allocate your <Votes>{votingPower}</Votes> votes!
      </h3>
      <p className="mt-2.5 text-base text-zinc-600">Decide how to allocate the budget.</p>
      <div className="mt-6 flex items-center space-x-4">
        <Button size="base" disabled={isEditing} color="outline" onClick={() => setIsEditing(true)}>
          {!isEditing && "Edit votes"}
          {isEditing && "Voting in progress..."}
        </Button>
      </div>
    </div>
  );
};
