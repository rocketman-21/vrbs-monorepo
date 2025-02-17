"use client";

import { Button } from "@cobuild/ui/atoms/Button";
import { TxnWalletStatus } from "app/components/onchain/TxnWalletStatus";
import { useCancelProposal } from "./hooks/useCancelProposal";
import { useCanCancelProposal } from "./hooks/useCanCancelProposal";

interface Props {
  proposalId: string;
  governanceContract: `0x${string}`;
  votingPowerContract?: `0x${string}`;
  chainId: number;
  color?: "primary" | "transparent" | "outline";
  size?: "sm" | "md";
}

export const CancelProposalButton = ({
  proposalId,
  governanceContract,
  chainId,
  votingPowerContract,
  color,
  size = "md",
}: Props) => {
  const { cancelProposal, isCanceling, isAwaitingTransaction, transactionHash, isSuccess } =
    useCancelProposal(governanceContract, chainId, proposalId);

  const { canCancel } = useCanCancelProposal(
    governanceContract,
    chainId,
    proposalId,
    votingPowerContract,
  );

  if (!canCancel) return null;

  return (
    <>
      <div className="flex flex-col space-y-1.5">
        <Button
          disabled={isCanceling || isAwaitingTransaction || !canCancel}
          onClick={() => cancelProposal()}
          grow
          color={color || "primary"}
          size={size}
        >
          Cancel Proposal
        </Button>
      </div>
      {canCancel && (
        <TxnWalletStatus
          isAwaitingTransaction={isAwaitingTransaction}
          isAwaitingWallet={isCanceling}
          chainId={chainId}
          isSuccessful={isSuccess}
          transactionHash={transactionHash}
        />
      )}
    </>
  );
};
