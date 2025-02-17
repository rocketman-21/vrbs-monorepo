import { useCheckWallet } from "@cobuild/libs/hooks/useCheckWallet";
import { revolutionDaoLogicV1Abi } from "@cobuild/revolution";
import { getAddress } from "viem";
import { useReadContract } from "wagmi";

export const useRevolutionProposal = (
  contract: `0x${string}`,
  chainId: number,
  proposalId: string,
) => {
  const { walletChain, connectedAddress } = useCheckWallet(chainId);

  const { data: proposal, isLoading } = useReadContract({
    abi: revolutionDaoLogicV1Abi,
    address: getAddress(contract),
    chainId,
    functionName: "proposals",
    args: [BigInt(proposalId)],
    query: { enabled: !!connectedAddress && chainId === walletChain?.id },
  });

  return {
    proposal,
    isLoading,
  };
};
