import { useCheckWallet } from "@cobuild/libs/hooks/useCheckWallet";
import { revolutionVotingPowerAbi } from "@cobuild/revolution";
import { getAddress } from "viem";
import { useReadContract } from "wagmi";

export const usePastVotingPower = (
  chainId: number,
  blockNumber?: bigint,
  account?: `0x${string}`,
  contract?: `0x${string}`,
) => {
  const { walletChain, connectedAddress } = useCheckWallet(chainId);

  const { data: votingPower, isLoading } = useReadContract({
    abi: revolutionVotingPowerAbi,
    address: contract ? getAddress(contract) : undefined,
    chainId,
    functionName: "getPastVotes",
    args: account && blockNumber ? [account, blockNumber] : undefined,
    query: { enabled: !!connectedAddress && chainId === walletChain?.id },
  });

  return {
    votingPower: votingPower || BigInt(0),
    isLoading,
  };
};
