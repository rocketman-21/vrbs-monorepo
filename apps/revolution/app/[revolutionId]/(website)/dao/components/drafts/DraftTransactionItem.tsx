"use client";

import { IDraft, TransactionType } from "@cobuild/database/types";
import { shortenIfEthAddress } from "@cobuild/libs/utils/account";
import { etherscanNetworkUrl } from "@cobuild/libs/utils/url";
import { getNetworkName } from "@cobuild/libs/web3/utils";
import Link from "next/link";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useRouter } from "next/navigation";
import { removeTransaction } from "./removeTransaction";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { useDraft } from "./useDraft";
import SvgClose from "@cobuild/ui/pixel-icons/Close";
import Loader from "@cobuild/ui/pixel-icons/Loader";
import { useTransition } from "react";
import { UserProfileClient } from "app/components/user-profile/UserProfileClient";

interface Props {
  transaction: IDraft["transactions"][number];
  draftId: string;
  revolutionId: string;
  canManage?: boolean;
}

export const DraftTransactionItem = (props: Props) => {
  const { transaction, draftId, revolutionId, canManage } = props;
  const { target, amount, type, symbol, chainId, from, contractAddress } = transaction;
  const router = useRouter();
  const { mutate } = useDraft(draftId, revolutionId);
  const [isPending, startTransition] = useTransition();

  const deleteTransaction = () => {
    startTransition(async () => {
      try {
        await removeTransaction(draftId, {
          type: TransactionType.SendAmount,
          from,
          target,
          amount,
          contractAddress: contractAddress ?? undefined,
          chainId,
          symbol,
          revolutionId,
        });

        await mutate();
        toast.success("Transaction removed");
        router.refresh();
      } catch (e: any) {
        console.error(e);
        toast.error(getErrorMessage(e) || "Couldn't remove transaction. Try again");
      }
    });
  };

  return (
    <div className="flex flex-row justify-between space-x-2">
      <dl className="py-4">
        <dt className="flex items-center text-sm">
          {new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(amount)} {symbol} to
          <UserProfileClient address={target as `0x${string}`}>
            {({ profilePicture, username, address, displayUsername }) => (
              <span className="ml-1.5 inline-flex items-center space-x-1">
                <Avatar id={target} imageUrl={profilePicture} size="16" />
                <Link
                  href={etherscanNetworkUrl(address, chainId, "address")}
                  className="hover:underline"
                >
                  {displayUsername}
                </Link>
              </span>
            )}
          </UserProfileClient>
        </dt>
        <dl className="mt-0.5 text-xs text-zinc-500">
          from{" "}
          <a
            href={etherscanNetworkUrl(from, chainId, "address")}
            className="hover:underline"
            target="_blank"
          >
            {shortenIfEthAddress(from)}
          </a>{" "}
          on {getNetworkName(chainId)}
        </dl>
      </dl>
      {canManage && (
        <button onClick={deleteTransaction} type="button" className="duration-150">
          {!isPending ? (
            <SvgClose className="h-4 w-4 text-zinc-500 duration-150 hover:text-black dark:hover:text-white" />
          ) : (
            <Loader className="h-4 w-4 animate-spin" />
          )}
        </button>
      )}
    </div>
  );
};
