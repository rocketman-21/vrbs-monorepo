import "server-only";

import { base, baseSepolia, mainnet, optimism, polygon, sepolia } from "viem/chains";
import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";
import NextCacheAddon from "../../api/next-cache-addon";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const ALCHEMY_API_KEY_POLYGON = process.env.ALCHEMY_API_KEY_POLYGON;
const ALCHEMY_API_KEY_BASE = process.env.ALCHEMY_API_KEY_BASE;
const ALCHEMY_API_KEY_SEPOLIA = process.env.ALCHEMY_API_KEY_SEPOLIA;
const ALCHEMY_API_KEY_BASE_SEPOLIA = process.env.ALCHEMY_API_KEY_BASE_SEPOLIA;
const ALCHEMY_API_KEY_OP_MAINNET = process.env.ALCHEMY_API_KEY_OP_MAINNET;

export function alchemyApi(chainId: number, options?: RequestInit) {
  const network = getAlchemyNetwork(chainId);
  const apiKey = getAlchemyApiKey(chainId);

  return wretch(`https://${network}.g.alchemy.com/nft/v3/${apiKey}`, options)
    .addon(QueryStringAddon)
    .addon(NextCacheAddon);
}

function getAlchemyApiKey(chainId: number) {
  switch (chainId) {
    case mainnet.id:
      return ALCHEMY_API_KEY;
    case base.id:
      return ALCHEMY_API_KEY_BASE;
    case polygon.id:
      return ALCHEMY_API_KEY_POLYGON;
    case sepolia.id:
      return ALCHEMY_API_KEY_SEPOLIA;
    case baseSepolia.id:
      return ALCHEMY_API_KEY_BASE_SEPOLIA;
    case optimism.id:
      return ALCHEMY_API_KEY_OP_MAINNET;
    default:
      throw new Error(`No Alchemy API key found for ${chainId}`);
  }
}

function getAlchemyNetwork(chainId: number) {
  const networks = {
    [mainnet.id]: "eth-mainnet",
    [base.id]: "base-mainnet",
    [polygon.id]: "polygon-mainnet",
    [sepolia.id]: "eth-sepolia",
    [baseSepolia.id]: "base-sepolia",
    [optimism.id]: "opt-mainnet",
  } as const;

  const network = networks[chainId as keyof typeof networks];
  if (!network) throw new Error(`ChainId ${chainId} not supported by Alchemy`);
  return network;
}
