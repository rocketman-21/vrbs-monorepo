import { getClientWithInfuraKey } from "@cobuild/libs/web3/viem/clients";

import { getContract } from "viem";
import { database } from "@cobuild/database";

import { ProposalStatus } from "@cobuild/database/types";
import { unstable_cache } from "next/cache";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { nounsDaoLogicV3Abi } from "../../../../../../../web3/wagmi";
import { INFURA_INGESTION_KEY } from "../../../../../../../consts";

//get proposal status
export const updateNounsDAOProposalStatus = unstable_cache(
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
        "get-nouns-proposal-status",
      );
      return null;
    }
  },
  undefined,
  { revalidate: 30, tags: ["nouns-proposal-status"] },
);

const proposalStatus = async (
  proposalId: string,
  chainId: number,
  contractAddress: `0x${string}`,
  entityId: string,
): Promise<ProposalStatus> => {
  const contract = getContract({
    address: contractAddress,
    abi: nounsDaoLogicV3Abi,
    client: { public: getClientWithInfuraKey(chainId, INFURA_INGESTION_KEY) },
  });

  const proposalStatusRaw = await contract.read.state([BigInt(proposalId)]);

  const status = getProposalStatusFromProposalState(proposalStatusRaw as NounsProposalState);

  await database.proposal.update({
    where: { proposalId_entityId: { entityId, proposalId: proposalId.toString() } },
    data: {
      status,
    },
  });

  return status;
};

/// @notice Possible states that a proposal may be in
enum NounsProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
  Vetoed,
  ObjectionPeriod, // from nouns v3
  Updateable, // from nouns v3
}

const getProposalStatusFromProposalState = (proposalState: NounsProposalState): ProposalStatus => {
  switch (proposalState) {
    case NounsProposalState.Pending:
      return "pending";
    case NounsProposalState.Active:
      return "active";
    case NounsProposalState.Canceled:
      return "cancelled";
    case NounsProposalState.Defeated:
      return "defeated";
    case NounsProposalState.Succeeded:
      return "succeeded";
    case NounsProposalState.Queued:
      return "queued";
    case NounsProposalState.Expired:
      return "expired";
    case NounsProposalState.Executed:
      return "executed";
    case NounsProposalState.Vetoed:
      return "vetoed";
    default:
      return "pending";
  }
};
