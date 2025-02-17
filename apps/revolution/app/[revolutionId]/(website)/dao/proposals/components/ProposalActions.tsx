"use client";

import { QueueProposalButton } from "app/components/buttons/governance/revolution/QueueNounishProposal";
import { CancelProposalButton } from "app/components/buttons/governance/revolution/CancelNounishProposal";
import { ProposalStatus } from "@cobuild/database/types";
import { ExecuteProposalButton } from "app/components/buttons/governance/revolution/ExecuteNounishProposal";

interface Props {
  proposalId: string;
  status: ProposalStatus;
  daoContract: `0x${string}`;
  chainId: number;
  votingPowerContract?: `0x${string}`;
}

export const ProposalActions = ({
  proposalId,
  daoContract,
  chainId,
  votingPowerContract,
  status,
}: Props) => {
  return (
    <>
      {status === "succeeded" && (
        <QueueProposalButton
          chainId={chainId}
          proposalId={proposalId}
          governanceContract={daoContract}
        />
      )}

      {status === "queued" && (
        <ExecuteProposalButton
          chainId={chainId}
          proposalId={proposalId}
          governanceContract={daoContract}
        />
      )}

      {!["executed", "cancelled"].includes(status) && (
        <CancelProposalButton
          color="outline"
          chainId={chainId}
          size="sm"
          proposalId={proposalId}
          governanceContract={daoContract}
          votingPowerContract={votingPowerContract}
        />
      )}
    </>
  );
};
