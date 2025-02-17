import "server-only";

import { reportApiError } from "../../utils/apiError";
import { getErrorMessage } from "../../utils/error";
import { alchemyApi } from "./client";
import { Nft } from "./types";

export async function getNftForOwner(args: {
  contractAddress: `0x${string}`;
  owner: `0x${string}`;
  chainId: number;
}) {
  const { contractAddress, owner, chainId } = args;

  const data = await alchemyApi(chainId)
    .url(`/getNFTsForOwner?contractAddresses[]=${contractAddress}`)
    .query({ owner, pageSize: 100 })
    .next({ revalidate: 480, tags: ["nft-ownership", "auction"] })
    .get()
    .json<{ ownedNfts: Nft[]; totalCount: number }>()
    .catch(e => {
      console.error(e);
      reportApiError(getErrorMessage(e.json.error.message), args, "getNftForOwner");
      return null;
    });

  console.debug(`Alchemy: Got ${data?.totalCount} NFTs for ${owner}`);

  return data?.ownedNfts || [];
}
