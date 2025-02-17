import {
  MAINNET_RELAY_API,
  TESTNET_RELAY_API,
  convertViemChainToRelayChain,
  createClient,
} from "@reservoir0x/relay-sdk";
import {
  Chain,
  arbitrum,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
} from "viem/chains";

export function createRelayClient(chainId: number) {
  const isTestnet = [baseSepolia.id, sepolia.id, optimismSepolia.id].includes(chainId as any);

  // Available options: https://docs.relay.link/resources/supported-chains
  const chains: Chain[] = [mainnet, base, optimism, arbitrum];

  if (isTestnet) {
    chains.push(sepolia);
    chains.push(baseSepolia);
    chains.push(optimismSepolia);
  }

  return createClient({
    baseApiUrl: isTestnet ? TESTNET_RELAY_API : MAINNET_RELAY_API,
    source: "co.build",
    chains: chains.map(chain => convertViemChainToRelayChain(chain)),
  });
}
