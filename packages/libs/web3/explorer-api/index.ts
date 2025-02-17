import "server-only";

import { goerli, mainnet, polygon, sepolia } from "viem/chains";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;

import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";
import NextCacheAddon from "../../api/next-cache-addon";

export function explorerApi(chainId: number, options?: RequestInit) {
  const [baseUrl, apikey] = getApiDetails(chainId);
  return wretch(baseUrl, options).addon(QueryStringAddon).addon(NextCacheAddon).query({ apikey });
}

function getApiDetails(chainId: number) {
  switch (chainId) {
    case mainnet.id:
      return ["https://api.etherscan.io/api", ETHERSCAN_API_KEY];
    case goerli.id:
      return ["https://api-goerli.etherscan.io/api", ETHERSCAN_API_KEY];
    case sepolia.id:
      return ["https://api-sepolia.etherscan.io/api", ETHERSCAN_API_KEY];
    case polygon.id:
      return ["https://api.polygonscan.com/api", POLYGONSCAN_API_KEY];
    default:
      throw new Error(`Chain id not supported: ${chainId}`);
  }
}
