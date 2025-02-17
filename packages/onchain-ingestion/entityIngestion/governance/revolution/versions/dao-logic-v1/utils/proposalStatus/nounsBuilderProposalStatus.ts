import { getClientWithInfuraKey } from "@cobuild/libs/web3/viem/clients";

import { getContract } from "viem";
import { database } from "@cobuild/database";

import { ProposalStatus } from "@cobuild/database/types";
import { unstable_cache } from "next/cache";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { nounsBuilderGovernorV1Abi } from "../../../../../../../web3/wagmi";
import { INFURA_INGESTION_KEY } from "../../../../../../../consts";

//get proposal status
export const updateNounsBuilderProposalStatus = unstable_cache(
  async (
    proposalId: `0x${string}`,
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
        "get-nouns-proposal-status",
      );
      return null;
    }
  },
  undefined,
  { revalidate: 30, tags: ["nouns-proposal-status"] },
);

const proposalStatus = async (
  proposalId: `0x${string}`,
  chainId: number,
  contractAddress: `0x${string}`,
  entityId: string,
): Promise<ProposalStatus> => {
  const contract = getContract({
    address: contractAddress,
    abi: nounsBuilderGovernorV1Abi,
    client: { public: getClientWithInfuraKey(chainId, INFURA_INGESTION_KEY) },
  });

  const proposalStatusRaw = await contract.read.state([proposalId]);

  const status = getProposalStatusFromProposalState(proposalStatusRaw as NounsBuilderProposalState);

  await database.proposal.update({
    where: { proposalId_entityId: { entityId, proposalId: proposalId.toString() } },
    data: {
      status,
    },
  });

  return status;
};

/// @notice Possible states that a proposal may be in
enum NounsBuilderProposalState {
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
  proposalState: NounsBuilderProposalState,
): ProposalStatus => {
  switch (proposalState) {
    case NounsBuilderProposalState.Pending:
      return "pending";
    case NounsBuilderProposalState.Active:
      return "active";
    case NounsBuilderProposalState.Canceled:
      return "cancelled";
    case NounsBuilderProposalState.Defeated:
      return "defeated";
    case NounsBuilderProposalState.Succeeded:
      return "succeeded";
    case NounsBuilderProposalState.Queued:
      return "queued";
    case NounsBuilderProposalState.Expired:
      return "expired";
    case NounsBuilderProposalState.Executed:
      return "executed";
    case NounsBuilderProposalState.Vetoed:
      return "vetoed";
    default:
      return "pending";
  }
};
