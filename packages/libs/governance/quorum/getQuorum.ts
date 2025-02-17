import { getContract } from "viem";
import { nounsDaoLogicV2Abi } from "../../../onchain-ingestion/web3/wagmi";
import { getClient } from "../../web3/viem/clients";
import { nounsDaoLogicV1Abi } from "../../web3/wagmi";

/**
 * Calculate dynamic quorum for a given proposal.
 * @param {Object} proposalId - The proposalId to calculate dynamic quorum for.
 */
export async function getQuorumForProposal(
  proposalId: string,
  contractAddress: `0x${string}`,
  chainId: number,
): Promise<bigint> {
  const contract = getContract({
    address: contractAddress,
    abi: nounsDaoLogicV2Abi,
    client: { public: getClient(chainId) },
  });
  return await contract.read.quorumVotes([BigInt(proposalId)]);
}

export async function getQuorumForV1Proposal(
  contractAddress: `0x${string}`,
  chainId: number,
): Promise<bigint> {
  const contract = getContract({
    address: contractAddress,
    abi: nounsDaoLogicV1Abi,
    client: { public: getClient(chainId) },
  });
  return await contract.read.quorumVotes();
}
