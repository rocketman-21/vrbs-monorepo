"use client";

import { IDraft, Serialized, TrackerType } from "@cobuild/database/types";
import { useCheckWallet } from "@cobuild/libs/hooks/useCheckWallet";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { etherscanNetworkUrl } from "@cobuild/libs/utils/url";
import { getNetworkName } from "@cobuild/libs/web3/utils";
import { getClient } from "@cobuild/libs/web3/viem/clients";
import { Button } from "@cobuild/ui/atoms/Button";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { storeTransactionEvent } from "onchain-ingestion/functions/storeTransactionEvent";
import pluralize from "pluralize";
import { useState } from "react";
import { getAddress } from "viem";
import { useCreateProposalNouns } from "../useCreateProposalNouns";

interface Props {
  draft: Serialized<IDraft>;
  chainId: number;
  governanceContract: `0x${string}`;
  proposalThreshold: string;
  trackerType: TrackerType;
  revolutionId: string;
  onPublish: (data: Partial<IDraft> & { toastId: string }) => Promise<void>;
}

export const DraftPublishNouns = (props: Props) => {
  const {
    revolutionId,
    onPublish,
    draft,
    chainId,
    governanceContract,
    proposalThreshold,
    trackerType,
  } = props;

  const { checkWallet, connectedAddress: address } = useCheckWallet(chainId);
  const [toastId, setToastId] = useState<string>("");
  const { governancePower } = useUser();

  const { status, propose } = useCreateProposalNouns({
    address: governanceContract,
    chainId,
    transactions: draft.transactions,
    proposal: `# ${draft.title}\n\n${draft.body}`,
    onPendingTransaction: () => {
      const id = toast.loading("Saving onchain...", { duration: 60000 });
      setToastId(id);
    },
    onSuccess: async transactionHash => {
      let proposalId: string | undefined;
      toast.loading("Indexing proposal...", { duration: 60000, id: toastId });
      proposalId = governanceContract
        ? await ingestProposal(
            getAddress(governanceContract),
            chainId,
            trackerType,
            transactionHash,
          )
        : undefined;
      onPublish({ transactionHash, proposalId, toastId });
    },
    onError: error => {
      console.error(error);
      toast.error(getErrorMessage(error));
    },
  });

  if (!governanceContract) return null;

  const hasPowerToPublish = governancePower >= BigInt(proposalThreshold);

  const publish = async () => {
    try {
      const checkWalletValid = await checkWallet();
      if (!checkWalletValid) {
        throw new Error(`Please connect your wallet to ${getNetworkName(chainId)}`);
      }

      if (draft.isOnChain) throw new Error(`Proposal has been already published`);

      if (draft.transactions.length === 0) throw new Error(`At least one transaction is required`);

      if (draft.title.length < 1 || draft.body.length < 1) {
        throw new Error(`Missing proposal content`);
      }

      propose();
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error));
    }
  };

  if (draft.isOnChain) {
    return (
      <>
        <h3 className="font-semibold">Proposal onchain</h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
          The proposal has been already published.
        </p>
        {draft.transactionHash && (
          <a href={etherscanNetworkUrl(draft.transactionHash, chainId, "tx")} target="_blank">
            <Button fullWidth size="base" color="outline" className="mt-5">
              View transaction
            </Button>
          </a>
        )}
      </>
    );
  }

  return (
    <>
      <h3 className="font-semibold">Publish onchain</h3>
      <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-500">
        {hasPowerToPublish && "Submit the proposal to start the voting process."}
        {!hasPowerToPublish &&
          `You don't meet the threshold (${proposalThreshold}) to submit the proposal. You have ${governancePower} ${pluralize(
            "vote",
            Number(governancePower),
          )}.`}
      </p>
      <fieldset className="mt-5 space-y-4">
        <Button
          fullWidth
          size="md"
          onClick={() => publish()}
          disabled={["processing", "success"].includes(status) || !hasPowerToPublish}
        >
          {status === "processing" ? "Publishing..." : "Publish onchain"}
        </Button>
      </fieldset>
    </>
  );
};

const ingestProposal = async (
  governanceContract: `0x${string}`,
  chainId: number,
  trackerType: TrackerType,
  transactionHash: `0x${string}`,
) => {
  const client = getClient(chainId);

  const receipt = await client.waitForTransactionReceipt({ hash: transactionHash });
  return await storeTransactionEvent(receipt, chainId, {
    trackerType,
    contract: governanceContract,
    chainId,
  });
};
