import { PublicClient, createPublicClient, http, Chain } from "viem";
import {
  base,
  baseSepolia,
  goerli,
  mainnet,
  optimism,
  polygon,
  polygonMumbai,
  sepolia,
  arbitrum,
} from "viem/chains";

const INFURA_ID = process.env.INFURA_PROJECT_ID || process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;

const clients: Record<number, PublicClient> = {};

interface SupportedChain {
  chain: Chain;
  domain?: string;
  subdomain?: string;
}

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

const supportedChains: Record<number, SupportedChain> = {
  [mainnet.id]: { chain: mainnet, subdomain: "mainnet" },
  [sepolia.id]: { chain: sepolia, subdomain: "sepolia" },
  [arbitrum.id]: { chain: arbitrum, subdomain: "arbitrum-mainnet" },
  [goerli.id]: { chain: goerli, subdomain: "goerli" },
  [polygon.id]: { chain: polygon, subdomain: "polygon-mainnet" },
  [polygonMumbai.id]: { chain: polygonMumbai, subdomain: "polygon-mumbai" },
  [baseSepolia.id]: {
    chain: baseSepolia,
    domain: `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    subdomain: "",
  },
  [base.id]: {
    chain: base,
    domain: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    subdomain: "",
  },
  [optimism.id]: {
    chain: optimism,
    domain: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    subdomain: "",
  },
};

export function getClientWithInfuraKey(chainId: number, infuraKey?: string): PublicClient {
  // console.log({ clients, chainId });
  if (clients[chainId]) return clients[chainId]; // Re-use existing client
  if (chainId === base.id || chainId === baseSepolia.id || chainId === optimism.id) {
    return (clients[chainId] = createAlchemyClient(chainId));
  }
  return (clients[chainId] = createClient(chainId, infuraKey));
}

export function getClient(chainId: number): PublicClient {
  // console.log({ clients, chainId });
  if (clients[chainId]) return clients[chainId]; // Re-use existing client
  if (chainId === base.id || chainId === baseSepolia.id || chainId === optimism.id) {
    return (clients[chainId] = createAlchemyClient(chainId));
  }
  return (clients[chainId] = createClient(chainId));
}

export const createAlchemyClient = (chainId: number): PublicClient => {
  const { chain, domain } = supportedChains[chainId as keyof typeof supportedChains];
  return createPublicClient({
    chain,
    transport: http(domain),
    batch: { multicall: { wait: 64, batchSize: 4_096 } },
  }) as PublicClient;
};

function createClient(chainId: number, infuraKey?: string) {
  validateChain(chainId);
  const { chain, subdomain, domain } = supportedChains[chainId as keyof typeof supportedChains];

  return createPublicClient({
    chain,
    transport: http(
      domain ? domain : `https://${subdomain}.infura.io/v3/${infuraKey || INFURA_ID}`,
    ),
    batch: { multicall: { wait: 64, batchSize: 4_096 } },
  }) as PublicClient;
}

function validateChain(chainId: number) {
  if (!supportedChains.hasOwnProperty(chainId)) {
    throw new Error(`Client not available for chainId: ${chainId}`);
  }
}
