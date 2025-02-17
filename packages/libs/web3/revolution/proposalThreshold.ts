import { getAddress, getContract } from "viem";
import { cacheResult } from "../../cache";
import { getClient } from "../viem/clients";
import { revolutionDaoLogicV1Abi } from "@cobuild/revolution";

async function getRevolutionContract(address: `0x${string}`, chainId: number) {
  return getContract({
    address: getAddress(address),
    abi: revolutionDaoLogicV1Abi,
    client: { public: getClient(chainId) },
  });
}

export async function getRevolutionProposalThreshold(address: `0x${string}`, chainId: number) {
  return cacheResult(`revolution-proposalThreshold_${address}_${chainId}`, 3600, async () => {
    const contract = await getRevolutionContract(address, chainId);
    const threshold = await contract.read.proposalThreshold();
    return threshold.toString();
  });
}
