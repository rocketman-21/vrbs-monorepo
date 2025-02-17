import { useAccount, useBlockNumber } from "wagmi";
import { usePastVotingPower } from "./usePastVotingPower";
import { useRevolutionProposal } from "./useRevolutionProposal";

export const useCanCancelProposal = (
  governanceContract: `0x${string}`,
  chainId: number,
  proposalId: string,
  votingPowerContract?: `0x${string}`,
) => {
  const { data: block } = useBlockNumber();

  const { address } = useAccount();

  const { proposal } = useRevolutionProposal(governanceContract, chainId, proposalId);

  const { votingPower: proposerVotingPower, isLoading } = usePastVotingPower(
    chainId,
    block,
    proposal?.proposer,
    votingPowerContract,
  );

  const isProposer = proposal?.proposer.toLowerCase() === address?.toLowerCase();

  const isAvailableToCancel =
    proposal &&
    proposal.executed === false &&
    (isProposer ||
      // Ensure proposer maintains enough voting power over lifecycle of proposal
      // Ignore this case for gnars/nouns as they don't have a voting power contract we can call easily
      (!!votingPowerContract &&
        !!proposerVotingPower &&
        proposerVotingPower <= proposal.proposalThreshold));

  return {
    canCancel: isAvailableToCancel,
    isLoading,
  };
};
