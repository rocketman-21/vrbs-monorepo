import "server-only";

import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { IDraft } from "@cobuild/database/types";
import { serializeSync } from "@cobuild/database/utils";
import { getDaoTreasuryBalance } from "@cobuild/libs/web3/balance";
import { Button } from "@cobuild/ui/atoms/Button";
import Link from "next/link";
import pluralize from "pluralize";
import { AddTransactionModal } from "./AddTransactionModal";
import { DraftTransactionItem } from "./DraftTransactionItem";

interface Props {
  draft: IDraft;
  revolutionId: string;
  canManage: boolean;
}

export const DraftTransactions = async (props: Props) => {
  const { draft, revolutionId, canManage } = props;
  const { transactions } = draft;

  const revolution = await Revolutions().getById(revolutionId);

  if (!revolution) return null;

  const { vaults, tokens } = revolution;

  const balances = (await getDaoTreasuryBalance(vaults, tokens)).filter(
    //ensure it's not staked eth - not sure how those txns are supposed to work yet
    b => b.balance > 0 && b.contractAddress != "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
  );

  const canAddTransaction = canManage && balances.length > 0;

  return (
    <>
      {canAddTransaction && (
        <AddTransactionModal
          draft={serializeSync(draft)}
          balances={balances}
          revolutionId={revolutionId}
        />
      )}
      <div className="bg-card rounded-2xl p-5">
        <div className="flex items-center justify-between space-x-1">
          <h3 className="font-semibold">
            {canAddTransaction ? "Request funding" : "Funding requests"}
          </h3>
          {canAddTransaction && (
            <Link href="?addTransaction=true">
              <Button color="outline" size="sm">
                + Add
              </Button>
            </Link>
          )}
        </div>
        <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-500">
          {transactions.length === 0
            ? canAddTransaction
              ? "Add transactions to request funding."
              : "No funding requests yet."
            : `Contains ${transactions.length} ${pluralize(
                "transaction",
                transactions.length,
              )}, that will be executed when the proposal passes.`}
        </p>
        {transactions.length > 0 && (
          <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-700">
            {transactions.map(t => (
              <DraftTransactionItem
                draftId={draft.draftId}
                revolutionId={revolutionId}
                transaction={t}
                canManage={canManage}
                key={`${t.target}_${t.from}_${t.amount}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
