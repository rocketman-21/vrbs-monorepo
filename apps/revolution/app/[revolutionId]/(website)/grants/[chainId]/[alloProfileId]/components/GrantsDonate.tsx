"use client";

import { IGrant, Serialized } from "@cobuild/database/types";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { InternalTxn } from "@cobuild/libs/web3/explorer-api/explorerApi";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { Button } from "@cobuild/ui/atoms/Button";
import DateRelative from "@cobuild/ui/atoms/DateRelative";
import { Ether } from "@cobuild/ui/atoms/Ether";
import SvgGift from "@cobuild/ui/pixel-icons/Gift";
import { UserProfileClient } from "app/components/user-profile/UserProfileClient";
import { UserProfilePopover } from "app/components/user-profile/UserProfilePopover";
import Link from "next/link";
import { useState } from "react";
import { GrantsDonateModal } from "./GrantsDonateModal";

interface Props {
  grant: Serialized<IGrant>;
  donations: InternalTxn[];
}

interface Donation {
  address: `0x${string}`;
  amount: string;
  time: string;
  symbol: string;
}

export function GrantsDonate(props: Props) {
  const { grant, donations } = props;
  const { login, isAuthenticated } = useUser();
  const [showDonateModal, setShowDonateModal] = useState(false);

  const donators: Donation[] = donations.map(donation => ({
    address: donation.from as `0x${string}`,
    amount: (
      BigInt(donation.value) * BigInt(10 ** (18 - parseInt(donation.tokenDecimal || "18")))
    ).toString(),
    time: donation.timeStamp, // Assuming timestamp is available in donation
    symbol: donation.tokenSymbol || "ETH",
  }));

  const renderDonatorProfile = (donation: Donation) => (
    <UserProfileClient address={donation.address} key={`${donation.address}_${donation.time}`}>
      {profile => (
        <UserProfilePopover profile={profile} revolutionId={grant.revolutionId}>
          <div className="flex items-center space-x-2">
            <Avatar id={donation.address} imageUrl={profile.profilePicture} size={36} />

            <div className="text-left">
              <Link
                href={`/${grant.revolutionId}/users/${profile.username}`}
                className="text-sm font-medium text-zinc-800"
              >
                {profile.displayUsername}
              </Link>
              <div className="flex items-center space-x-1 text-xs text-zinc-500">
                <strong className="font-medium">
                  <Ether amount={BigInt(donation.amount)} symbol={donation.symbol as "ETH"} />
                </strong>
                <span>•</span>
                <div>
                  <DateRelative date={new Date(Number(donation.time) * 1000)} />
                </div>
              </div>
            </div>
          </div>
        </UserProfilePopover>
      )}
    </UserProfileClient>
  );

  return (
    <div className="flex flex-col items-start space-y-5">
      {donators.length > 0 && <div className="space-y-5">{donators.map(renderDonatorProfile)}</div>}
      <Button
        onClick={() => {
          if (!isAuthenticated) return login();
          setShowDonateModal(true);
        }}
        type="button"
        color="outline"
      >
        <SvgGift className="mr-1.5 size-4" /> Donate
      </Button>
      <GrantsDonateModal
        isOpen={showDonateModal}
        closeModal={() => setShowDonateModal(false)}
        grant={grant}
      />
    </div>
  );
}
