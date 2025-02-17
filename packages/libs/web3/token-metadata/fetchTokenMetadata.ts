import "server-only";

import { ITokenMetadata } from ".";
import { getNftMetadata } from "../alchemy/getNftMetadata";
import { convertIpfsToHttp } from "../utils";

export async function fetchTokenMetadata(
  tokenId: number | string,
  contractAddress: `0x${string}`,
  chainId: number,
): Promise<ITokenMetadata | null> {
  const nft = await getNftMetadata({ tokenId, contractAddress, chainId });

  if (!nft || !nft.name) return null;

  const image = nft.image.originalUrl || null;
  const animation_url = `${nft.raw?.metadata?.animation_url}` || null;

  return {
    name: nft.name,
    description: nft.description || "",
    image: image ? convertIpfsToHttp(image) : "",
    animation_url: animation_url ? convertIpfsToHttp(animation_url) : "",
  };
}
