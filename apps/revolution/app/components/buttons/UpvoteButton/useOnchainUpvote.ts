"use client";

import { CultureIndexVersion } from "@cobuild/database/types";
import { useCheckWallet } from "@cobuild/libs/hooks/useCheckWallet";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { useWalletError } from "@cobuild/libs/hooks/useWalletError";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { getCultureIndexAbi } from "@cobuild/libs/web3/revolution/cultureIndexAbi";
import { useVotingPowerForPiece } from "@cobuild/libs/web3/revolution/useVotingPowerForPiece";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { formatVotes } from "app/components/Votes";
import { useRevolution } from "app/libs/useRevolution";
import { useWaitForTransaction } from "app/libs/useWaitForTransaction";
import { storeTransactionEvent } from "onchain-ingestion/functions/storeTransactionEvent";
import { useEffect, useState } from "react";
import { getAddress } from "viem/utils";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

type Args = {
  pieceId: string;
  chainId: number;
  contractAddress: `0x${string}`;
  logicContractVersion: CultureIndexVersion;
  enabled?: boolean;
  initialVotesWeight: number;
  onVote?: () => void;
};

export function useOnchainUpvote(args: Args) {
  const { pieceId, chainId, contractAddress, logicContractVersion, initialVotesWeight, onVote } =
    args;
  const { address, isConnected } = useAccount();
  const { reportWalletError } = useWalletError();
  const { login, isAuthenticated } = useUser();
  const { checkWallet } = useCheckWallet(chainId);
  const { cultureIndex, addresses, descriptor } = useRevolution();
  const [toastId, setToastId] = useState<string>();
  const [reason, setReason] = useState("");

  const enabled = args.enabled === true && isConnected;

  const {
    votingPower,
    totalVotingPower,
    isLoading: isVotingPowerLoading,
    isSuccess: isVotingPowerSuccess,
  } = useVotingPowerForPiece({
    enabled,
    votingPowerContract: addresses?.revolutionVotingPower,
    pieceId,
    chainId,
    contractAddress,
    logicContractVersion,
  });

  const abi = getCultureIndexAbi(logicContractVersion);

  const {
    data: hasVoted = false,
    refetch: refetchHasVoted,
    isLoading: isHasVotedLoading,
  } = useReadContract({
    abi,
    address: getAddress(contractAddress),
    chainId,
    functionName: "hasVoted",
    args: address ? [BigInt(pieceId), address] : undefined,
    query: { enabled },
  });

  const { data: piece } = useReadContract({
    abi,
    address: getAddress(contractAddress),
    chainId,
    functionName: "getPieceById",
    args: pieceId ? [BigInt(pieceId)] : undefined,
    query: { enabled },
  });

  const {
    writeContractAsync,
    isPending: isWriting,
    data: hash,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        const id = toast.loading("Saving onchain...", { duration: 60000 });
        setToastId(id);
      },
    },
  });

  const { refetch: refetchVoteWeight, data: voteWeight } = useReadContract({
    abi,
    address: getAddress(contractAddress),
    chainId,
    functionName: "totalVoteWeights",
    args: [BigInt(pieceId)],
  });

  const { isLoading: isWaiting } = useWaitForTransaction({
    chainId,
    hash,
    onSuccess: async receipt => {
      try {
        console.debug("Vote success", receipt.transactionHash);

        refetchVoteWeight();
        refetchHasVoted();

        await storeTransactionEvent(receipt, chainId, {
          trackerType: "culture_index",
          contract: contractAddress,
          chainId,
        });

        if (onVote) onVote();

        toast.success("Successfully voted 🎉", { id: toastId, duration: 5000 });
      } catch (e: any) {
        console.error(e);
        toast.error(getErrorMessage(e));
        reportWalletError(e, "voteOnchain", contractAddress, "vote");
      }
    },
  });

  const isDropped = piece?.isDropped || false;

  const minVotingPowerToVote = cultureIndex?.minVotingPowerToVote || 0;
  const hasEnoughVotingPower = votingPower > 0 && votingPower >= minVotingPowerToVote;
  const canVote = hasEnoughVotingPower && !isDropped && !hasVoted;

  const isLoading = isWriting || isWaiting || isVotingPowerLoading || isHasVotedLoading;

  useEffect(() => {
    if (!isConnected) return setReason("Connect your wallet to vote.");
    if (canVote || isLoading || !isVotingPowerSuccess) return setReason("");
    if (hasVoted) return setReason("You have already voted on this piece.");
    if (isDropped) return setReason("Piece has been auctioned.");
    if (hasEnoughVotingPower === false) {
      return setReason(
        `You need ${minVotingPowerToVote < 10 ? "" : `at least ${formatVotes(minVotingPowerToVote, "revolution")}`} voting power to vote. ${totalVotingPower > 0 ? `You have voting power, but not at the time this piece was created. Please responsor the piece to proceed.` : ""}`,
      );
    }
    return setReason("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    canVote,
    isDropped,
    hasEnoughVotingPower,
    totalVotingPower,
    isLoading,
    isConnected,
    isVotingPowerSuccess,
    hasVoted,
    isAuthenticated,
  ]);

  return {
    voteWeight: voteWeight || BigInt(initialVotesWeight),
    votingPower,
    canVote,
    hasVoted,
    isDropped,
    hasEnoughVotingPower,
    vote: async () => {
      if (!isConnected) return login();
      if (!canVote && reason) return toast.error(reason);

      if (await checkWallet()) {
        try {
          return await writeContractAsync({
            abi,
            address: getAddress(contractAddress),
            chainId,
            functionName: "vote",
            args: [BigInt(pieceId)],
          });
        } catch (e) {
          console.error(e);
          toast.error(getErrorMessage(e));
        }
      }
    },
    isLoading: isWriting || isWaiting || isLoading || isHasVotedLoading,
    isWriting,
    isWaiting,
    reason,
  };
}
