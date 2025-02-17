"use client";

import { CreatorSplit } from "@cobuild/database/types";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { getCultureIndexAbi } from "@cobuild/libs/web3/revolution/cultureIndexAbi";
import { CultureIndexMediaType } from "@cobuild/libs/web3/revolution/types";
import { useCultureIndex } from "@cobuild/libs/web3/revolution/useCultureIndex";
import { getChain } from "@cobuild/libs/web3/utils";
import { thatsGnarlyCultureIndexAbi } from "@cobuild/libs/web3/wagmi";
import { useContractWrite } from "app/libs/useContractWrite";
import { useRevolution } from "app/libs/useRevolution";
import { getAddress } from "viem/utils";
import { uploadZoraMintData } from "@cobuild/libs/storage/Zora";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { generateVideoThumbnail } from "@cobuild/libs/media";
import { PinataStorage } from "@cobuild/libs/storage/Pinata";

type Args = {
  onSuccess: (transactionHash: string, slug?: string) => Promise<void>;
  contractAddress: `0x${string}`;
  chainId: number;
};

export function useOnchainPublish(args: Args) {
  const { onSuccess, contractAddress, chainId } = args;

  const { cultureIndex } = useCultureIndex(contractAddress, chainId);
  const { revolutionId } = useRevolution();

  const { status, write } = useContractWrite({
    contract: contractAddress,
    chainId,
    type: "createPiece",
    trackerType: "culture_index",
    onSuccess,
    waitingText: "Saving onchain...",
    successText: "Art submitted 🎉",
  });

  const { votingPower, user } = useUser();

  return {
    status,
    createPiece: async (
      metadata: {
        name: string;
        description: string;
        image: string;
        mediaType: CultureIndexMediaType;
        text: string;
        animationUrl: string;
      },
      creators: CreatorSplit[],
    ) => {
      await write(async client => {
        if (cultureIndex && votingPower < cultureIndex?.minVotingPowerToCreate) {
          throw new Error(
            `You need at least ${cultureIndex?.minVotingPowerToCreate} voting power to create.`,
          );
        }

        let image = metadata.image;
        const animationUrl = convertIpfs(metadata.animationUrl);

        if (!cultureIndex?.requiresSvg) {
          if (image.includes("/ipfs/") || image.includes(".ipfs.")) {
            image = convertIpfs(metadata.image);
          }
        } else {
          if (!image.startsWith("data:image/svg+xml")) {
            throw new Error("SVG required");
          }
        }

        if (revolutionId === "thatsgnarly") {
          if (!image && animationUrl) {
            const toastId = toast.loading("Generating thumbnail...");
            const blob = await generateVideoThumbnail(metadata.animationUrl, 1.5);
            const file = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
            const { url: thumbnailIpfs } = await PinataStorage.upload(file);
            image = convertIpfs(thumbnailIpfs);
            toast.dismiss(toastId);
          }

          const isAnimation = metadata.mediaType === CultureIndexMediaType.ANIMATION;
          const toastId = toast.loading("Uploading to IPFS...");
          const { ipfsHash } = await uploadZoraMintData(
            metadata.name,
            metadata.description || "",
            {
              mime: isAnimation ? "video/*" : "image/*",
              uri: isAnimation ? animationUrl : image,
            },
            image,
            animationUrl,
          );

          if (!ipfsHash) {
            throw new Error("Failed to upload to IPFS");
          }
          toast.dismiss(toastId);

          let tokenURI = `ipfs://${ipfsHash}`;

          return client.simulateContract({
            account: getAddress(user || ""),
            address: contractAddress,
            chain: getChain(chainId),
            abi: thatsGnarlyCultureIndexAbi,
            functionName: "createPiece",
            args: [
              {
                ...metadata,
                tokenURI,
                animationUrl,
                image,
              },
              creators.map(c => ({ creator: getAddress(c.address), bps: BigInt(c.bps) })),
            ],
          });
        }

        return client.simulateContract({
          account: getAddress(user || ""),
          address: contractAddress,
          chain: getChain(chainId),
          abi: getCultureIndexAbi("v1"),
          functionName: "createPiece",
          args: [
            {
              ...metadata,
              animationUrl,
              image,
            },
            creators.map(c => ({ creator: getAddress(c.address), bps: BigInt(c.bps) })),
          ],
        });
      });
    },
  };
}

//convert https://revolution.mypinata.cloud/ipfs/QmWWGBzTxYJpHeQ8tGU5qL2yPJi8i4keVxv18cNzeDnUfz to ipfs://hash
// also handle https://bafybeicvlutokfefu44t57djrx4d4cny3vm6rvksembxsteg24rlfk43om.ipfs.nftstorage.link
function convertIpfs(url: string) {
  if (!url) return "";
  let hash = url.split("/ipfs/").pop();

  // handle https://[hash].ipfs.nftstorage.link
  if (hash?.includes(".ipfs.nftstorage.link")) {
    hash = hash.split(".ipfs.nftstorage.link")[0];
    // remove https://
    hash = hash.split("://").pop();
  }

  // ensure hash has nothing but alphanumeric, otherwise return error
  if (!hash?.match(/^[a-z0-9]+$/i)) {
    throw new Error("Invalid IPFS hash");
  }

  return `ipfs://${hash}`;
}
