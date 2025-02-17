"use client";

import { Button } from "@cobuild/ui/atoms/Button";
import { useQueueProposal } from "./hooks/useQueueProposal";
import { TxnWalletStatus } from "app/components/onchain/TxnWalletStatus";

interface Props {
  proposalId: string;
  governanceContract: `0x${string}`;
  chainId: number;
}

export const QueueProposalButton = ({ proposalId, governanceContract, chainId }: Props) => {
  const { queueProposal, isQueuing, isAwaitingTransaction, transactionHash, isSuccess } =
    useQueueProposal(governanceContract, chainId, proposalId);

  return (
    <>
      <Button
        disabled={isQueuing || isAwaitingTransaction}
        onClick={() => queueProposal()}
        grow
        size="md"
        fullWidth
        className=""
      >
        Queue Proposal
      </Button>
      <TxnWalletStatus
        isAwaitingTransaction={isAwaitingTransaction}
        isAwaitingWallet={isQueuing}
        chainId={chainId}
        isSuccessful={isSuccess}
        transactionHash={transactionHash}
      />
    </>
  );
};
