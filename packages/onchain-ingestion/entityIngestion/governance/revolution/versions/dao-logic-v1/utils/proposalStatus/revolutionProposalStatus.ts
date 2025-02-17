import { getClientWithInfuraKey } from "@cobuild/libs/web3/viem/clients";

import { getContract } from "viem";
import { revolutionDaoLogicV1Abi } from "@cobuild/revolution";
import { database } from "@cobuild/database";

import { ProposalStatus } from "@cobuild/database/types";
import { unstable_cache } from "next/cache";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { INFURA_INGESTION_KEY } from "../../../../../../../consts";

//get proposal status
export const updateRevolutionDAOProposalStatus = unstable_cache(
  async (
    proposalId: string,
    chainId: number,
    contractAddress: `0x${string}`,
    entityId: string,
  ): Promise<ProposalStatus | null> => {
    try {
      return await proposalStatus(proposalId, chainId, contractAddress, entityId);
    } catch (e) {
      console.error(e);
      reportApiError(
        e,
        { proposalId, chainId, contractAddress, entityId },
        "get-revolution-proposal-status",
      );
      return null;
    }
  },
  undefined,
  { revalidate: 30, tags: ["revolution-proposal-status"] },
);

const proposalStatus = async (
  proposalId: string,
  chainId: number,
  contractAddress: `0x${string}`,
  entityId: string,
): Promise<ProposalStatus> => {
  const contract = getContract({
    address: contractAddress,
    abi: revolutionDaoLogicV1Abi,
    client: { public: getClientWithInfuraKey(chainId, INFURA_INGESTION_KEY) },
  });

  const proposalStatusRaw = await contract.read.state([BigInt(proposalId)]);

  const status = getProposalStatusFromProposalState(proposalStatusRaw as RevolutionProposalState);

  await database.proposal.update({
    where: { proposalId_entityId: { entityId, proposalId: proposalId.toString() } },
    data: {
      status,
    },
  });

  return status;
};

/// @notice Possible states that a proposal may be in
enum RevolutionProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
  Vetoed,
}

const getProposalStatusFromProposalState = (
  proposalState: RevolutionProposalState,
): ProposalStatus => {
  switch (proposalState) {
    case RevolutionProposalState.Pending:
      return "pending";
    case RevolutionProposalState.Active:
      return "active";
    case RevolutionProposalState.Canceled:
      return "cancelled";
    case RevolutionProposalState.Defeated:
      return "defeated";
    case RevolutionProposalState.Succeeded:
      return "succeeded";
    case RevolutionProposalState.Queued:
      return "queued";
    case RevolutionProposalState.Expired:
      return "expired";
    case RevolutionProposalState.Executed:
      return "executed";
    case RevolutionProposalState.Vetoed:
      return "vetoed";
    default:
      return "pending";
  }
};
