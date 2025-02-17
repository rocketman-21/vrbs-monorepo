import * as chains from "viem/chains";
import { Chain } from "viem/chains";

export function convertIpfsToHttp(
  url: string,
  provider:
    | "nftstorage"
    | "ipfs"
    | "cloudflare"
    | "mypinata"
    | "decentralized-content" = "mypinata",
) {
  if (!url) return "";
  if (!url.startsWith("ipfs://")) return url;
  const hash = url.replace("ipfs://", "");

  const domains: Record<typeof provider, string> = {
    nftstorage: "nftstorage.link",
    ipfs: "ipfs.io",
    cloudflare: "cloudflare-ipfs.com",
    mypinata: "revolution.mypinata.cloud",
    "decentralized-content": "magic.decentralized-content.com",
  };

  return `https://${domains[provider]}/ipfs/${hash}`;
}

export function isValidChainId(chainId: number) {
  try {
    getChain(chainId);
    return true;
  } catch (e: any) {
    return false;
  }
}

export function getNetworkName(chainId: number): string {
  try {
    return getChain(chainId).name;
  } catch (e) {
    return "Unknown";
  }
}

export function getNetworkLogoUrl(chainId: number) {
  const networkName = getNetworkName(chainId);
  return `/images/utility-img/network-logos/${networkName.toLowerCase().replace(" ", "-")}.svg`;
}

export function getChain(chainId: number): Chain {
  const chain = Object.values(chains).find(c => c.id === chainId);
  if (!chain) throw new Error("Invalid chainId");
  return chain;
}

export function isTestnet(chainId: number) {
  return getChain(chainId).testnet;
}

export function getChainByName(name: string): Chain {
  const chain = Object.values(chains).find(c => c.name.toLowerCase() === name.toLowerCase());
  if (!chain) throw new Error(`Couldn't find chain ${name}`);
  return chain;
}
