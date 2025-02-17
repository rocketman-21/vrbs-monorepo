"use client";

import { Button } from "@cobuild/ui/atoms/Button";
import { TxnWalletStatus } from "app/components/onchain/TxnWalletStatus";
import { useExecuteProposal } from "./hooks/useExecuteProposal";
import { useRevolutionProposal } from "./hooks/useRevolutionProposal";
import pluralize from "pluralize";
import { timeUntil } from "@cobuild/libs/utils/numbers";

interface Props {
  proposalId: string;
  governanceContract: `0x${string}`;
  chainId: number;
}

export const ExecuteProposalButton = ({ proposalId, governanceContract, chainId }: Props) => {
  const { executeProposal, isExecuting, isAwaitingTransaction, transactionHash, isSuccess } =
    useExecuteProposal(governanceContract, chainId, proposalId);

  const { proposal } = useRevolutionProposal(governanceContract, chainId, proposalId);

  const isAvailableToExecute =
    proposal && proposal.eta && proposal.eta < BigInt(Math.ceil(Date.now() / 1000));

  const startDateLabels =
    proposal && !isAvailableToExecute && getDateLabels(new Date(Number(proposal.eta) * 1000));

  return (
    <>
      <div className="flex flex-col space-y-1.5">
        <Button
          disabled={isExecuting || isAwaitingTransaction || !isAvailableToExecute}
          onClick={() => executeProposal()}
          grow
          size="md"
        >
          Execute Proposal
        </Button>
        {startDateLabels && (
          <div className="flex justify-center space-x-2 text-xs text-zinc-500">
            <span>Execute in</span>
            {startDateLabels.map(({ label, value }) => (
              <span key={label}>
                {value} {label}
              </span>
            ))}
          </div>
        )}
      </div>
      {isAvailableToExecute && (
        <TxnWalletStatus
          isAwaitingTransaction={isAwaitingTransaction}
          isAwaitingWallet={isExecuting}
          chainId={chainId}
          isSuccessful={isSuccess}
          transactionHash={transactionHash}
        />
      )}
    </>
  );
};

const getDateLabels = (date: Date) => {
  const {
    days: daysUntil,
    hours: hoursUntil,
    minutes: minutesUntil,
    seconds: secondsUntil,
  } = timeUntil(date);

  const labels = [];
  if (daysUntil > 0) labels.push({ label: pluralize("day", daysUntil), value: daysUntil });
  if (hoursUntil > 0) labels.push({ label: pluralize("hour", hoursUntil), value: hoursUntil });
  if (daysUntil == 0 && minutesUntil > 0)
    labels.push({ label: pluralize("min", minutesUntil), value: minutesUntil });
  if (daysUntil == 0 && secondsUntil > 0)
    labels.push({ label: pluralize("sec", secondsUntil), value: secondsUntil });

  return labels;
};
