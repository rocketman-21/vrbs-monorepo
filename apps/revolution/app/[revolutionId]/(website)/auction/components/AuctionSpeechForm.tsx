"use client";

import { deleteCacheResult } from "@cobuild/libs/cache";
import { generateAuctionUniqueId } from "@cobuild/libs/web3/auction/auction-uniqueid";
import { getChain } from "@cobuild/libs/web3/utils";
import { auctionHouseAbi } from "@cobuild/revolution";
import { Button } from "@cobuild/ui/atoms/Button";
import TextArea from "@cobuild/ui/atoms/TextArea";
import { useContractWrite } from "app/libs/useContractWrite";
import { useRevolution } from "app/libs/useRevolution";
import { useState } from "react";
import { getAddress } from "viem";

interface Props {
  user: `0x${string}`;
  revolutionId: string;
  tokenId: string;
  speech: string | null;
}

export const AuctionSpeechForm = (props: Props) => {
  const { tokenId, user, speech } = props;
  const { addresses, chainId, name } = useRevolution();
  const [newSpeech, setNewSpeech] = useState(speech || "");
  const auctionAddress = getAddress(addresses?.auction || "");
  const tokenAddress = getAddress(addresses?.token || "");

  const { write, status } = useContractWrite({
    chainId,
    contract: auctionAddress,
    type: "updateManifesto",
    trackerType: "revolution_auction",
    successText: "Speech updated!",
    waitingText: "Updating speech...",
    onSuccess: async () => {
      await deleteCacheResult(
        generateAuctionUniqueId(chainId, tokenId, tokenAddress, auctionAddress),
      );
    },
  });

  return (
    <form
      className="flex flex-col items-end space-y-2.5"
      onSubmit={async e => {
        e.preventDefault();
        if (status !== "idle") return;
        await write(client => {
          return client.simulateContract({
            account: user,
            address: auctionAddress,
            abi: auctionHouseAbi,
            chain: getChain(chainId),
            functionName: "updateManifesto",
            args: [BigInt(tokenId), newSpeech.trim()],
          });
        });
      }}
    >
      <TextArea
        name="newSpeech"
        autosize
        className="w-full bg-white/50"
        size="lg"
        rows={4}
        placeholder={`Why did you join ${name}? Share your manifesto here...`}
        onSubmit={textarea => textarea.form?.requestSubmit()}
        onChange={e => setNewSpeech(e.target.value)}
        value={newSpeech}
      />
      <Button
        type="submit"
        size="md"
        pulse={status !== "idle"}
        disabled={status !== "idle" || speech === newSpeech}
        color={speech === newSpeech ? "outline" : "primary"}
      >
        {speech ? "Update speech" : "Publish speech"}
      </Button>
    </form>
  );
};
