import { base, baseGoerli, goerli, mainnet, polygon, polygonMumbai } from "viem/chains";
import { Currency } from "../utils/numbers";

export function getCurrencyFromChainId(chainId?: number): Currency {
  switch (chainId) {
    case mainnet.id:
    case goerli.id:
    case baseGoerli.id:
    case base.id:
      return "eth";
    case polygon.id:
    case polygonMumbai.id:
      return "matic";
    default:
      return "eth";
  }
}
