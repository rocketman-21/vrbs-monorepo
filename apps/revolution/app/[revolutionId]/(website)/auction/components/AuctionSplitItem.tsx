import "server-only";

import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { getGovernanceTokenQuote } from "@cobuild/libs/web3/auction/governance-token";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { Ether } from "@cobuild/ui/atoms/Ether";
import { Votes } from "app/components/Votes";
import { VotingPowerIcon } from "app/components/VotingPowerIcon";
import { notFound } from "next/navigation";
import { UserProfile } from "app/components/user-profile/UserProfile";
import Link from "next/link";

interface Props {
  revolutionId: string;
  address: `0x${string}`;
  bps: number;
  points: number;
  directPayment: number;
  governancePayment: number;
  creatorRateBps: number;
  entropyRateBps: number;
  wasBurned: boolean;
}

export const AuctionSplitItem = async (props: Props) => {
  const {
    revolutionId,
    address,
    directPayment,
    governancePayment,
    creatorRateBps,
    wasBurned,
    entropyRateBps,
    points: creatorPoints,
  } = props;

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution) notFound();

  const { addresses, chainId, name, descriptor } = revolution;
  if (!addresses || !chainId || !descriptor) notFound();

  const points =
    addresses.pointsEmitter && (creatorPoints || governancePayment > 0)
      ? await getGovernanceTokenQuote(addresses.pointsEmitter, chainId, Number(governancePayment))
      : null;

  return (
    <UserProfile
      address={address}
      revolutionId={revolutionId}
      popover={
        <>
          {wasBurned && (
            <>
              <h5 className="text-center text-sm font-medium text-zinc-600 dark:text-zinc-300">
                The {descriptor.tokenNamePrefix} has been burned
              </h5>
              <p className="mt-0.5 text-center text-xs text-zinc-600">No rewards for the creator</p>
            </>
          )}
          {!wasBurned && (
            <>
              <h3 className="text-center text-base font-medium text-zinc-800 dark:text-zinc-100">
                Creator&apos;s rewards:
              </h3>
              <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                <div className="bg-lead-100 text-lead-950 flex items-center justify-center rounded-lg px-1.5 py-2.5 text-lg font-semibold">
                  <span className="mr-1">Ξ</span>
                  <Ether amount={directPayment > 1 ? BigInt(directPayment) : BigInt(0)} />
                </div>
                <div className="bg-lead-100 text-lead-950 flex items-center justify-center rounded-lg px-1.5 py-2.5 text-lg font-semibold">
                  <VotingPowerIcon className="mr-1 size-4" />
                  <Votes>{points || 0}</Votes>
                </div>
              </div>
              <div className="mt-4 text-center text-sm font-medium text-zinc-600 dark:text-zinc-100">
                {name} <span className="text-lead-500 inline-block translate-y-0.5">♥️</span>{" "}
                creators
              </div>
              <div className="mt-0.5 text-center text-xs text-zinc-500 dark:text-zinc-300">
                Artists get {creatorRateBps / 100}% of proceeds.
                <br />
                {(creatorRateBps * entropyRateBps) / 1e6}% in ETH,{" "}
                {(creatorRateBps * (10000 - entropyRateBps)) / 1e6}% in votes.
              </div>
            </>
          )}
        </>
      }
    >
      {profile => (
        <Link
          href={`/${revolutionId}/users/${profile.username}`}
          className="inline-flex items-center space-x-1.5"
        >
          <Avatar id={address} size={28} imageUrl={profile.profilePicture} />
          <span className="hover:text-lead-500 dark:hover:text-lead-300 font-medium text-zinc-600 dark:text-zinc-100">
            {profile.displayUsername}
          </span>
        </Link>
      )}
    </UserProfile>
  );
};
