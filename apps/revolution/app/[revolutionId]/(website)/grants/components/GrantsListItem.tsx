"use client";

import { IGrant, IGrantVote, Serialized } from "@cobuild/database/types";
import { AnimatedNumber } from "@cobuild/ui/atoms/AnimatedNumber";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { StackedAvatars } from "@cobuild/ui/atoms/StackedAvatars";
import { TextInput } from "@cobuild/ui/atoms/TextInput/TextInput";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { formatVotes } from "app/components/Votes";
import { UserProfilePopover } from "app/components/user-profile/UserProfilePopover";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { OpportunitiesBadge } from "./OpportunitiesBadge";

interface Props {
  grant: Serialized<IGrant, "members">;
  votes: IGrantVote[];
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  canVote: boolean;
  updateVote: (recipient: `0x${string}`, bps: number) => void;
}

export const GrantsListItem = (props: Props) => {
  const { grant, votes, isEditing, setIsEditing, canVote, updateVote } = props;
  const {
    poolBalance,
    memberFlowRate,
    imageUrl,
    title,
    url,
    tagline,
    monthlyFlowRate,
    salaryRecipientAddress,
    totalVotes,
    openings,
    revolutionId,
    members,
    isApplicable,
    isApplication,
  } = grant;

  const [totalEarned, setTotalEarned] = useState(BigInt(poolBalance.totalEarned));

  const isApproved = poolBalance.isApprovedRecipient;

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalEarned(prevPool => prevPool + BigInt(memberFlowRate) * 2n);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <tr>
      <td className="py-5 lg:w-20 lg:min-w-20">
        <Image
          className="lg:w-9/10 aspect-square rounded-xl object-cover max-sm:hidden"
          src={imageUrl}
          alt={title}
          width={72}
          height={72}
        />
      </td>
      <td className="px-2 py-5 md:px-3">
        {grant.isOpenGrantPool && (!isApplicable || openings > 0) && <OpportunitiesBadge />}
        <h3>
          <Link
            href={url}
            className="hover:text-lead-600 font-medium tracking-tight text-zinc-900 md:text-xl"
          >
            {isApplication ? title.split(" for ")[0] : title}
          </Link>
        </h3>
        {tagline && <p className="text-sm text-zinc-500 max-sm:hidden md:text-[15px]">{tagline}</p>}
        {members.length > 0 && (
          <StackedAvatars className="mt-1 lg:mt-2" max={{ desktop: 8, mobile: 4 }}>
            {members.map(profile => (
              <UserProfilePopover
                profile={profile}
                revolutionId={revolutionId}
                key={profile.address}
              >
                <Link href={`/${revolutionId}/users/${profile.username}`}>
                  <Avatar id={profile.address} size={24} imageUrl={profile.profilePicture} />
                </Link>
              </UserProfilePopover>
            ))}
          </StackedAvatars>
        )}
      </td>
      <td className="px-3 text-center">
        <span className="bg-lead-500 inline-block rounded-md px-2 py-0.5 text-sm font-medium tabular-nums text-white">
          {Intl.NumberFormat("en", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(Number(formatEther(BigInt(monthlyFlowRate))))}
          /mo
        </span>
      </td>
      <td className="px-3 text-center text-sm tabular-nums">
        {isApproved && (
          <AnimatedNumber
            value={Number(formatEther(totalEarned))}
            format={v =>
              Intl.NumberFormat("en", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 6,
                minimumFractionDigits: 6,
              }).format(Number(v))
            }
          />
        )}
        {!isApproved && <Tooltip subtitle="Not approved yet">-</Tooltip>}
      </td>
      <td className="px-3 text-center text-sm tabular-nums">
        {isApproved && formatVotes(totalVotes, "revolution")}
        {!isApproved && <Tooltip subtitle="Not approved yet">-</Tooltip>}
      </td>
      {canVote && (
        <td className="pl-3 text-center text-sm tabular-nums">
          {isApproved && (
            <div className="inline-block w-24">
              {!isEditing && (
                <Tooltip subtitle="Click to edit">
                  <button onClick={() => setIsEditing(true)}>
                    {formatVotes(
                      (votes.find(v => v.recipient === salaryRecipientAddress)?.memberUnitsDelta ||
                        0) * 1e15,
                      "revolution",
                    )}
                  </button>
                </Tooltip>
              )}

              {isEditing && (
                <TextInput
                  name="percent"
                  maxLength={3}
                  append="%"
                  disabled={!poolBalance.isApprovedRecipient}
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={
                    (votes.find(v => v.recipient === salaryRecipientAddress)?.bps || 0) / 1e4
                  }
                  pattern="[0-9]"
                  onChange={e =>
                    updateVote(salaryRecipientAddress, parseInt(e.target.value, 10) * 1e4)
                  }
                />
              )}
            </div>
          )}
          {!isApproved && <Tooltip subtitle="Not approved yet">-</Tooltip>}
        </td>
      )}
    </tr>
  );
};
