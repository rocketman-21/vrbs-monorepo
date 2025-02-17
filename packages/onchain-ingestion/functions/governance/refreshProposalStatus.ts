"use server";

import { reportApiError } from "@cobuild/libs/utils/apiError";
import { GovernanceType, ProposalStatus } from "@cobuild/database/types";
import { updateNounsBuilderProposalStatus } from "../../entityIngestion/governance/revolution/versions/dao-logic-v1/utils/proposalStatus/nounsBuilderProposalStatus";
import { updateRevolutionDAOProposalStatus } from "../../entityIngestion/governance/revolution/versions/dao-logic-v1/utils/proposalStatus/revolutionProposalStatus";
import { updateNounsDAOProposalStatus } from "../../entityIngestion/governance/revolution/versions/dao-logic-v1/utils/proposalStatus/nounsProposalStatus";

export async function refreshProposalStatus(
  proposalId: string,
  governanceContractAddress: `0x${string}`,
  entityId: string,
  chainId: number,
  type: GovernanceType,
): Promise<ProposalStatus | null> {
  try {
    if (type === "revolution") {
      return updateRevolutionDAOProposalStatus(
        proposalId,
        chainId,
        governanceContractAddress,
        entityId,
      );
    }
    if (type === "nouns") {
      return updateNounsDAOProposalStatus(proposalId, chainId, governanceContractAddress, entityId);
    }
    if (type === "nounsbuilder") {
      return updateNounsBuilderProposalStatus(
        proposalId as `0x${string}`,
        chainId,
        governanceContractAddress,
        entityId,
      );
    }

    return null;
  } catch (error) {
    console.error(error);
    reportApiError(
      error,
      JSON.stringify({ proposalId, entityId, chainId }),
      "update-proposal-status",
    );
    return null;
  }
}
