import { getAddress, getContract } from "viem";
import { cacheResult } from "../../cache";
import { getClient } from "../viem/clients";
import { nounsBuilderGovernorV1Abi } from "../wagmi";

async function getNounsBuilderContract(address: `0x${string}`, chainId: number) {
  return getContract({
    address: getAddress(address),
    abi: nounsBuilderGovernorV1Abi,
    client: { public: getClient(chainId) },
  });
}

export async function getNounsBuilderProposalThreshold(address: `0x${string}`, chainId: number) {
  return cacheResult(`npt_${address}_${chainId}`, 3600, async () => {
    const contract = await getNounsBuilderContract(address, chainId);
    const threshold = await contract.read.proposalThreshold();
    return threshold.toString();
  });
}
