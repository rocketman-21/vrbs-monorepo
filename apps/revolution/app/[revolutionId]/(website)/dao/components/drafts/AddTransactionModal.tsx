"use client";

import { IDraft, Serialized, TransactionType } from "@cobuild/database/types";
import { useUrlState } from "@cobuild/libs/hooks/useUrlState";
import { getShortEthAddress } from "@cobuild/libs/utils/account";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { etherscanNetworkUrl } from "@cobuild/libs/utils/url";
import { TreasuryBalance } from "@cobuild/libs/web3/balance";
import { getNetworkLogoUrl, getNetworkName } from "@cobuild/libs/web3/utils";
import { Button } from "@cobuild/ui/atoms/Button";
import { TextInput } from "@cobuild/ui/atoms/TextInput/TextInput";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { StaticModal } from "@cobuild/ui/molecules/StaticModal/StaticModal";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { RadioGroup } from "@headlessui/react";
import { AddressInput } from "app/components/AddressInput";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addTransaction } from "./addTransaction";
import { useDraft } from "./useDraft";

interface Props {
  draft: Serialized<IDraft>;
  balances: TreasuryBalance[];
  revolutionId: string;
}

export const AddTransactionModal = (props: Props) => {
  const { draft, balances, revolutionId } = props;
  const [isOpen, setIsOpen] = useUrlState("addTransaction");
  const [vault, setVault] = useState<TreasuryBalance>(balances[0]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { mutate } = useDraft(draft.draftId, revolutionId);

  const formId = `add-transaction-form-${draft.draftId}`;

  const closeModal = () => setIsOpen("");

  const saveTransaction = (formData: FormData) => {
    startTransition(async () => {
      try {
        const { target, amount } = Object.fromEntries(formData as any);
        await addTransaction(draft.draftId, {
          type: TransactionType.SendAmount,
          from: vault.address,
          target,
          amount: parseFloat(amount),
          contractAddress: vault.contractAddress,
          chainId: vault.chainId,
          symbol: vault.symbol,
          revolutionId,
        });

        closeModal();
        await mutate();
        toast.success("Transaction added");
        router.refresh();
      } catch (e: any) {
        console.error(e);
        toast.error(getErrorMessage(e) || "Couldn't add transaction. Try again");
      }
    });
  };

  return (
    <StaticModal
      isOpen={isOpen === "true"}
      closeModal={closeModal}
      title="Add Transaction"
      width="600px"
      showCloseButton
      actions={
        <Button size="md" disabled={isPending} type="submit" form={formId}>
          {isPending ? "Please wait... " : "Add Transaction"}
        </Button>
      }
    >
      <div className="flex w-full flex-col">
        <h1 className="mb-1 text-xl font-semibold max-sm:hidden dark:text-white">
          Add Transaction
        </h1>
        <h3 className="text-zinc-500 md:pr-8">
          Choose a source and enter the recipient address and amount to send.
        </h3>

        <form className="mt-6 space-y-4" id={formId} action={saveTransaction}>
          <RadioGroup
            value={vault || balances[0]}
            onChange={setVault}
            name="vault"
            className="space-y-4"
          >
            {balances.map(b => (
              <RadioGroup.Option
                key={`${b.address}_${b.chainId}_${b.contractAddress}`}
                value={b}
                className="ui-checked:border-lead-500 ui-active:border-lead-500 dark:ui-checked:border-lead-200 dark:ui-active:border-lead-200 flex cursor-pointer items-center justify-between rounded-lg border-2 border-zinc-500 px-4 py-2.5 focus:outline-none dark:border-zinc-700"
              >
                <div>
                  <RadioGroup.Label className="flex cursor-pointer items-center text-[15px] font-medium">
                    Send from {b.symbol} treasury
                  </RadioGroup.Label>
                  <RadioGroup.Description className="mt-0.5 text-[13px] text-zinc-500">
                    <Link
                      href={etherscanNetworkUrl(b.address, b.chainId, "address")}
                      className="hover:underline"
                      target="_blank"
                    >
                      {getShortEthAddress(b.address)}
                    </Link>
                  </RadioGroup.Description>
                </div>
                <RadioGroup.Description className="flex items-center text-[15px] font-medium">
                  <Tooltip subtitle={`${getNetworkName(b.chainId)}`}>
                    <Image
                      src={getNetworkLogoUrl(b.chainId)}
                      width="14"
                      height="14"
                      alt={getNetworkName(b.chainId)}
                      className="mr-1.5"
                    />
                  </Tooltip>
                  <Tooltip subtitle="Current balance">
                    {new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(b.balance)}
                    <span className="ml-0.5">{b.symbol}</span>
                  </Tooltip>
                </RadioGroup.Description>
              </RadioGroup.Option>
            ))}
          </RadioGroup>
          <AddressInput name="target" label="Recipient" size="lg" chainId={vault.chainId} />
          <TextInput
            name="amount"
            label="Amount"
            size="lg"
            placeholder="1"
            type="number"
            max={vault.balance}
            append={vault.symbol}
            step="0.001"
            required
          />
        </form>
      </div>
    </StaticModal>
  );
};
