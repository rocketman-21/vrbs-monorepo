import { getContract } from "viem";
import { nounsDaoLogicV2Abi } from "../../../onchain-ingestion/web3/wagmi";
import { getClient } from "../../web3/viem/clients";

interface NounsDynamicQuorum {
  totalSupply: bigint;
  minQuorumVotesBPS: number;
  maxQuorumVotesBPS: number;
  quorumCoefficient: number;
}

/**
 * Calculate dynamic quorum for a given proposal.
 * @param {Object} proposalId - The proposalId to calculate dynamic quorum for.
 */
export async function calculateDynamicQuorumForProposal(
  proposalId: string,
  contractAddress: `0x${string}`,
  chainId: number,
): Promise<NounsDynamicQuorum | null> {
  try {
    const contract = getContract({
      address: contractAddress,
      abi: nounsDaoLogicV2Abi,
      client: { public: getClient(chainId) },
    });
    let onchainProposal = await contract.read.proposals([BigInt(proposalId)]);
    let totalSupply = onchainProposal.totalSupply;

    let quorumParams = await contract.read.getDynamicQuorumParamsAt([
      onchainProposal.creationBlock,
    ]);

    let nounsDynamicQuorum = {
      totalSupply: totalSupply,
      minQuorumVotesBPS: quorumParams.minQuorumVotesBPS,
      maxQuorumVotesBPS: quorumParams.maxQuorumVotesBPS,
      quorumCoefficient: quorumParams.quorumCoefficient,
    };

    return nounsDynamicQuorum;
  } catch (e) {
    console.error(e);
    return null;
  }
}
