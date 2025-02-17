import "server-only";

import { unstable_cache } from "next/cache";
import { base, goerli, mainnet, polygon } from "viem/chains";
import { Currency, formatPrice } from "../numbers";
import { getEthRateData } from "./getEthRateData";

export interface ConversionRates {
  [mainnet.id]: number;
  [polygon.id]: number;
  [base.id]: number;
  [goerli.id]: number;
}

export const getConversionRates = unstable_cache(
  async (): Promise<ConversionRates | null> => {
    const data = await getEthRateData();
    if (!data) return null;

    const ethRate = data.eth;
    const maticRate = data.matic;

    return {
      [mainnet.id]: ethRate,
      [polygon.id]: maticRate,
      [base.id]: ethRate,
      [goerli.id]: ethRate,
    };
  },
  undefined,
  { revalidate: 3600 },
);

const getConversionRate = (rates: ConversionRates | null, chainId: number) => {
  if (!rates || !rates.hasOwnProperty(chainId)) {
    console.error(`Conversion rates not found for ${chainId}`);
    return null;
  }

  return rates[chainId as keyof ConversionRates];
};

export function convertToUSD(
  rates: ConversionRates | null,
  chainId: number,
  tokenAmount: number,
  shouldFormat: boolean = true,
) {
  const rate = getConversionRate(rates, chainId);
  if (!rate) return null;

  const value = parseFloat((tokenAmount * rate).toFixed(2));
  return shouldFormat ? formatPrice(value, "usd") : value;
}

export function convertToEth(
  rates: ConversionRates | null,
  chainId: number,
  tokenAmount: number,
  shouldFormat: boolean = false,
) {
  if (chainId === mainnet.id) return tokenAmount;

  const chainRate = getConversionRate(rates, chainId);
  const ethRate = getConversionRate(rates, mainnet.id);

  if (!chainRate || !ethRate) return null;

  const value = parseFloat((tokenAmount * (chainRate / ethRate)).toFixed(8));
  return shouldFormat ? formatPrice(value, "eth") : value;
}

export async function convertPrice(
  amount: number,
  from: Currency,
  to: "eth" | "usd",
  shouldFormat: boolean = true,
) {
  if (from === to) return shouldFormat ? formatPrice(amount, to) : amount;

  const rates = await getConversionRates();
  let convert;
  if (from === "usd") {
    convert = convertFromUSD;
  } else if (to === "eth") {
    convert = convertToEth;
  } else {
    convert = convertToUSD;
  }

  switch (from) {
    case "eth":
      return convert(rates, mainnet.id, amount, shouldFormat);
    case "matic":
      return convert(rates, polygon.id, amount, shouldFormat);
    case "usd":
      return convert(rates, to === "eth" ? mainnet.id : polygon.id, amount, shouldFormat);
    default:
      throw new Error(`Couldn't convert from ${from} to ${to}`);
  }
}

export function convertFromUSD(
  rates: ConversionRates | null,
  toChainId: number,
  dollarAmount: number,
  shouldFormat: boolean = true,
) {
  const ethRate = getConversionRate(rates, mainnet.id);
  if (!ethRate) return null;

  const targetChainRate = getConversionRate(rates, toChainId);
  if (!targetChainRate) return null;

  const tokenAmount = parseFloat(
    ((dollarAmount / ethRate) * (targetChainRate / ethRate)).toFixed(8),
  );
  return shouldFormat
    ? formatPrice(tokenAmount, toChainId === mainnet.id ? "eth" : "matic")
    : tokenAmount;
}
