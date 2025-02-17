import { getAddress, getContract } from "viem";
import { cacheResult } from "../../cache";
import { getClient } from "../viem/clients";
import { nounsDaoLogicV1Abi } from "../wagmi";

async function getNounsContract(address: `0x${string}`, chainId: number) {
  return getContract({
    address: getAddress(address),
    abi: nounsDaoLogicV1Abi,
    client: { public: getClient(chainId) },
  });
}

export async function getNounsProposalThreshold(address: `0x${string}`, chainId: number) {
  return cacheResult(`npt_${address}_${chainId}`, 3600, async () => {
    const contract = await getNounsContract(address, chainId);
    const threshold = await contract.read.proposalThreshold();
    return threshold.toString();
  });
}
