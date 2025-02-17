"use client";

import { IGrant, IProfile, Serialized } from "@cobuild/database/types";
import { deleteCacheResult } from "@cobuild/libs/cache";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { getChain } from "@cobuild/libs/web3/utils";
import { revolutionGrantsAbi } from "@cobuild/revolution";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { Button } from "@cobuild/ui/atoms/Button";
import DateRelative from "@cobuild/ui/atoms/DateRelative";
import Markdown from "@cobuild/ui/atoms/Markdown";
import StaticModal from "@cobuild/ui/molecules/StaticModal/StaticModal";
import { UserProfilePopover } from "app/components/user-profile/UserProfilePopover";
import { useContractWrite } from "app/libs/useContractWrite";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { formatEther } from "viem";
import { approveGrantApplication } from "./approveGrantApplication";
import Link from "next/link";

interface Props {
  profile: IProfile;
  application: Serialized<IGrant>;
  canApprove: boolean;
}

export function GrantApplicationDetails(props: Props) {
  const { profile, application, canApprove } = props;
  const {
    chainId,
    parentContract,
    salaryRecipientAddress,
    alloProfileId,
    isApproved,
    monthlyFlowRate,
  } = application;
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { isConnected, connect, user } = useUser();

  const router = useRouter();

  const { write, status } = useContractWrite({
    chainId,
    contract: parentContract,
    type: "approveGrantApplication",
    successText: "Approved!",
    waitingText: "Approving...",
    onSuccess: async () => {
      await deleteCacheResult(`approvedRecipients_${salaryRecipientAddress}_${chainId}`);
      await approveGrantApplication(alloProfileId, chainId);
      router.refresh();
      setIsOpen(false);
    },
  });

  async function approveApplication() {
    startTransition(async () => {
      if (!isConnected || !user) {
        return connect();
      }

      await write(client => {
        return client.simulateContract({
          account: user,
          address: parentContract,
          abi: revolutionGrantsAbi,
          chain: getChain(chainId),
          functionName: "addApprovedRecipient",
          args: [salaryRecipientAddress],
        });
      });
    });
  }

  return (
    <>
      <button
        className="group flex w-full items-center justify-between space-x-2 text-left"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center space-x-2">
          <Avatar id={profile.address} imageUrl={profile.profilePicture} size={36} />

          <div>
            <div className="group-hover:text-lead-500 text-sm font-medium text-zinc-800 duration-100">
              {profile.displayUsername}
            </div>
            <div className="text-xs text-zinc-500">
              <DateRelative date={application.createdAt} />
            </div>
          </div>
        </div>
        {isApproved && (
          <span className="bg-lead-500 inline-block rounded-md px-2 py-1 text-xs font-medium tabular-nums text-white">
            {Intl.NumberFormat("en", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(Number(formatEther(BigInt(monthlyFlowRate))))}
            /month
          </span>
        )}
      </button>
      <StaticModal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        title={application.title}
        width={860}
        showCloseButton
        actions={
          <>
            <Button type="button" onClick={() => setIsOpen(false)} color="transparent">
              Close
            </Button>
            {!isApproved && canApprove && (
              <Button
                pulse={isPending || status !== "idle"}
                disabled={isPending || status !== "idle"}
                size="md"
                autoFocus
                onClick={approveApplication}
              >
                Approve application
              </Button>
            )}
          </>
        }
      >
        <main>
          <section>
            <h1 className="text-3xl font-semibold tracking-tight dark:text-white">
              {application.title}
            </h1>
            <div className="mt-2.5 flex items-center space-x-2.5 text-sm text-zinc-700">
              <UserProfilePopover profile={profile} revolutionId={application.revolutionId}>
                <div className="inline-flex items-center space-x-1.5">
                  <Avatar id={profile.address} imageUrl={profile.profilePicture} size={24} />
                  <Link href={`/${application.revolutionId}/users/${profile.username}`}>
                    <span className="duration-100 hover:opacity-75">{profile.displayUsername}</span>
                  </Link>
                </div>
              </UserProfilePopover>
              <span>•</span>
              <DateRelative date={application.createdAt} />
            </div>
            <div className="prose prose-a:text-lead-500 dark:prose-a:text-lead-300 prose-a:break-all mt-6 dark:text-white">
              <Markdown>{application.body}</Markdown>
            </div>
          </section>
        </main>
      </StaticModal>
    </>
  );
}
