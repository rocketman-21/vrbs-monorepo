import { base, baseSepolia, goerli, mainnet, optimism, polygon, sepolia } from "viem/chains";

export const getAbsoluteUrl = (path = "", hook = false): string => {
  if (path.startsWith("http")) {
    return path;
  }

  // eslint-disable-next-line turbo/no-undeclared-env-vars
  let url = process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000";

  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }

  // fix for github codespaces
  if (url.includes("githubpreview.dev") && !hook) {
    url = "http://localhost:3000";
  }

  url += path;

  if (url.startsWith("http")) {
    return url;
  }

  return url.includes("localhost") ? `http://${url}` : `https://${url}`;
};

export const etherscanNetworkUrl = (
  id: string,
  chainId: number,
  type: "tx" | "address" | "block" | "token" | "token-holdings" = "tx",
): string => {
  let baseUrl = "";

  switch (chainId) {
    case mainnet.id:
      baseUrl = "https://etherscan.io";
      break;
    case polygon.id:
      baseUrl = "https://polygonscan.com";
      break;
    case goerli.id:
      baseUrl = "https://goerli.etherscan.io";
      break;
    case base.id:
      baseUrl = "https://basescan.org";
      break;
    case sepolia.id:
      baseUrl = "https://sepolia.etherscan.io";
      break;
    case baseSepolia.id:
      baseUrl = "https://sepolia.basescan.org";
      break;
    case optimism.id:
      baseUrl = "https://optimistic.etherscan.io";
      break;
    default:
      baseUrl = "https://etherscan.io";
  }

  if (type === "token-holdings") {
    return `${baseUrl}/tokenholdings?a=${id}`;
  } else {
    return `${baseUrl}/${type}/${id}`;
  }
};

export const zoraProfileUrl = (address: `0x${string}`, chainId: number): string =>
  `https://zora.co/${address}`;

export function etherscanNftUrl(contractAddress: string, tokenId: string, chainId: number): string {
  return etherscanNetworkUrl(`${contractAddress}?a=${tokenId}`, chainId, "token");
}

export function openseaNftUrl(contractAddress: string, tokenId: string, chainId: number): string {
  let baseUrl = "";

  switch (chainId) {
    case sepolia.id:
      baseUrl = "https://testnets.opensea.io/assets/sepolia";
      break;
    case goerli.id:
      baseUrl = "https://testnets.opensea.io/assets/goerli";
      break;
    case baseSepolia.id:
      baseUrl = "https://testnets.opensea.io/assets/base-sepolia";
      break;
    case base.id:
      baseUrl = "https://opensea.io/assets/base";
      break;
    default:
      baseUrl = "https://opensea.io/assets";
  }

  return `${baseUrl}/${contractAddress}/${tokenId}`;
}
