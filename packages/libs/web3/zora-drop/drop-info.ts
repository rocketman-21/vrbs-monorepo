import { waitUntil } from "@vercel/functions";
import { getAddress, getContract } from "viem";
import { fetchIpfsData } from "../../storage/Ipfs";
import { pinByHash } from "../../storage/Pinata";
import { ITokenMetadata } from "../token-metadata";
import { convertIpfsToHttp, getChain } from "../utils";
import { getClient } from "../viem/clients";
import { zoraCreator1155Abi } from "../wagmi";
import { getSaleConfig, ISaleConfig } from "./sale-config";

interface IDropInfo {
  metadata: ITokenMetadata;
  saleConfig: ISaleConfig;
  totalMinted: string;
  zoraUrl: string;
  tokenURI: string;
  collectionOwner: `0x${string}`;
  creatorRewardRecipient: `0x${string}`;
}

export const getDropInfo = async (
  address: `0x${string}`,
  chainId: number,
  tokenId: string | number,
): Promise<IDropInfo | null> => {
  try {
    const contract = getContract({
      address: getAddress(address),
      client: { public: getClient(chainId) },
      abi: zoraCreator1155Abi,
    });

    const info = await contract.read.getTokenInfo([BigInt(tokenId)]);
    const collectionOwner = await contract.read.owner();
    const creatorRewardRecipient = await contract.read.getCreatorRewardRecipient([BigInt(tokenId)]);

    if (!info.uri) throw new Error("Invalid token info");

    const data = await fetchIpfsData<ITokenMetadata & { totalMinted: number; content?: any }>(
      info.uri,
    );

    if (!data.name) throw new Error("No metadata found");

    if (data.image) waitUntil(pinByHash(data.image.replace("ipfs://", "")));
    if (data.animation_url) waitUntil(pinByHash(data.animation_url.replace("ipfs://", "")));

    const saleConfig = await getSaleConfig(address, chainId, tokenId);
    if (!saleConfig) throw new Error("No sale config found");

    return {
      metadata: {
        name: data.name,
        description: data.description || "",
        // use zora gateway to get the image
        image: convertIpfsToHttp(data.image || "", "decentralized-content"),
        animation_url:
          data.animation_url !== data.image && data.animation_url !== data.content?.uri
            ? convertIpfsToHttp(data.animation_url || "", "decentralized-content")
            : "",
      },
      totalMinted: info.totalMinted.toString(),
      saleConfig,
      collectionOwner: collectionOwner.toLowerCase() as `0x${string}`,
      zoraUrl: `https://zora.co/collect/${getChain(chainId).name.toLowerCase()}:${address}/${tokenId}`,
      tokenURI: info.uri,
      creatorRewardRecipient: creatorRewardRecipient.toLowerCase() as `0x${string}`,
    };
  } catch (e: any) {
    console.error("Error fetching drop metadata:", e.message);
    return null;
  }
};
