import { revolutionTokenAbi } from "@cobuild/revolution";
import { getAddress, getContract } from "viem";
import { cacheResult } from "../../cache";
import { ITokenMetadata } from "../token-metadata";
import { fetchTokenMetadata } from "../token-metadata/fetchTokenMetadata";
import { convertIpfsToHttp } from "../utils";
import { getClient } from "../viem/clients";

export const getAuctionTokenMetadata = async (
  address: `0x${string}`,
  chainId: number,
  tokenId: string | number,
): Promise<ITokenMetadata | null> => {
  return cacheResult(`auction_token_metadata_${address}_${tokenId}`, 650, async () => {
    try {
      const contract = getContract({
        address: getAddress(address),
        abi: revolutionTokenAbi,
        client: { public: getClient(chainId) },
      });
      const tokenURI = await contract.read.tokenURI([BigInt(tokenId)]);
      const base64string = tokenURI.split("data:application/json;base64,")[1];
      const data = JSON.parse(Buffer.from(base64string, "base64").toString());

      if (!data.name) throw new Error("Invalid token metadata");

      return {
        name: data.name,
        description: data.description || "",
        image: convertIpfsToHttp(data.image || ""),
        animation_url: convertIpfsToHttp(data.animation_url || ""),
      };
    } catch (error) {
      // If token is burned, fallback to Alchemy data
      return await fetchTokenMetadata(tokenId, address, chainId);
    }
  });
};
