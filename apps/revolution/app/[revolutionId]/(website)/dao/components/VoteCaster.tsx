"use client";

import { IProposal, IVote, Serialized, TrackerType } from "@cobuild/database/types";
import { useCastVote } from "@cobuild/libs/governance/cast-vote/useCastVote";
import { useCheckWallet } from "@cobuild/libs/hooks/useCheckWallet";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { useWalletError } from "@cobuild/libs/hooks/useWalletError";
import { getEthAddress, getShortEthAddress } from "@cobuild/libs/utils/account";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { etherscanNetworkUrl } from "@cobuild/libs/utils/url";
import { getNetworkName } from "@cobuild/libs/web3/utils";
import { Button } from "@cobuild/ui/atoms/Button";
import { ConditionalWrapper } from "@cobuild/ui/atoms/ConditionalWrapper";
import TextArea from "@cobuild/ui/atoms/TextArea";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { Votes } from "app/components/Votes";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAccount } from "wagmi";
import { VoteButtons } from "./VoteButtons";
import { useVoteTransactionStatus } from "./hooks/useVoteTransactionStatus";

interface IVoteCasterProps {
  proposal: Serialized<IProposal>;
  daoContract: `0x${string}`;
  revolutionId: string;
  trackerType: TrackerType;
  userVote?: Pick<IVote, "optionId" | "proposalId"> | null;
}

export const VoteCaster = (props: IVoteCasterProps) => {
  const { proposal, daoContract, revolutionId, trackerType, userVote } = props;
  const { chainId, proposalId, options, hasPresetOptions } = proposal;

  const { login, governancePower, user } = useUser();
  const { isConnected, address } = useAccount();
  const { checkWallet } = useCheckWallet(chainId);
  const [reason, setReason] = useState("");
  const [selectedOptionId, setSelectedOptionId] = useState(userVote?.optionId);
  const { reportWalletError } = useWalletError();

  const { write: castVote, hash } = useCastVote(
    daoContract,
    trackerType,
    {
      proposalId,
      optionId: selectedOptionId,
      reason,
      onError: error => toast.error(getErrorMessage(error)),
    },
    chainId,
  );

  const { isSendingTransaction, isSuccess } = useVoteTransactionStatus({
    hash,
    chainId,
    contractAddress: daoContract,
    trackerType,
  });

  const alreadyVoted = isConnected && (!!userVote || isSuccess || isSendingTransaction);
  const canVote = isConnected && !alreadyVoted;

  return (
    <motion.div
      className="shadow-smooth-lg bg-card flex w-full shrink-0 grow-0 flex-col space-y-4 overflow-hidden rounded-t-2xl p-4 max-lg:sticky max-lg:inset-x-0 max-lg:bottom-0"
      variants={{
        expanded: { height: "auto" },
        collapsed: { height: 74 },
      }}
      initial="collapsed"
      animate={typeof selectedOptionId !== "undefined" ? "expanded" : "collapsed"}
      transition={{ duration: 0.2 }}
    >
      <VoteButtons
        options={options}
        hasPresetOptions={hasPresetOptions}
        onChange={setSelectedOptionId}
        selectedOptionId={selectedOptionId}
        alreadyVoted={alreadyVoted}
      />

      {!userVote && (
        <TextArea
          name="reason"
          type="text"
          autosize
          value={reason}
          rows={2}
          size="md"
          disabled={canVote === false}
          onChange={e => setReason(e.target.value)}
          placeholder={`Note your reason, e.g. "Love that it's cc0"`}
          maxHeight={200}
        />
      )}

      {alreadyVoted && (
        <ConditionalWrapper
          wrapper={children => (
            <a
              target="_blank"
              href={etherscanNetworkUrl(hash as string, chainId, "tx")}
              className="opacity-75 duration-150 hover:opacity-100"
            >
              {children}
            </a>
          )}
          condition={!!hash}
        >
          <div className="text-center text-xs">
            {isSendingTransaction && "Awaiting confirmation..."}
            {!isSendingTransaction && "Your vote has been submitted."}
          </div>
        </ConditionalWrapper>
      )}

      {!isConnected && <Button onClick={() => login()}>Connect Wallet</Button>}

      {canVote && (
        <Button
          size="md"
          onClick={async () => {
            try {
              const checkWalletValid = await checkWallet();
              if (!checkWalletValid) {
                throw new Error(`Please connect your wallet to ${getNetworkName(chainId)}`);
              }

              if (user && getEthAddress(user) !== getEthAddress(address)) {
                return toast.error(
                  `Please switch to your main wallet ${getShortEthAddress(user)}, or log out and sign back in with your current wallet.`,
                );
              }

              castVote();
            } catch (e: any) {
              const message = reportWalletError(e, "voteOnchain", daoContract, "castVote");
              toast.error(message);
            }
          }}
        >
          Vote with <Votes type="auto">{governancePower}</Votes> votes
        </Button>
      )}
    </motion.div>
  );
};

export default VoteCaster;
