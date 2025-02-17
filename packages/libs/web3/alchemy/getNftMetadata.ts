import "server-only";

import { reportApiError } from "../../utils/apiError";
import { getErrorMessage } from "../../utils/error";
import { alchemyApi } from "./client";
import { Nft } from "./types";

export async function getNftMetadata(args: {
  tokenId: number | string;
  contractAddress: `0x${string}`;
  chainId: number;
}) {
  const { tokenId, contractAddress, chainId } = args;

  const data = await alchemyApi(chainId)
    .url(`/getNFTMetadata`)
    .query({ contractAddress, tokenId })
    .next({ revalidate: 600, tags: ["nft-metadata"] })
    .get()
    .json<Nft>()
    .catch(e => {
      console.error(e);
      reportApiError(getErrorMessage(e.json.error.message), args, "getNftMetadata");
      return null;
    });

  if (!data) {
    console.error("Couldn't get NFT Metadata with Alchemy", { args });
    reportApiError("Couldn't get NFT Metadata with Alchemy", args, "getNftMetadata");
  } else {
    console.debug(`Alchemy: Got Nft metadata for ${contractAddress} - TokenID: ${tokenId}`);
  }

  return data;
}
