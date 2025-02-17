"use server";

import { revolutionPointsEmitterAbi } from "@cobuild/revolution";
import { unstable_cache } from "next/cache";
import { getAddress, getContract } from "viem";
import { reportApiError } from "../../utils/apiError";
import { getClient } from "../viem/clients";

export const getGovernanceTokenQuote = unstable_cache(
  async (pointsEmitterContract: string, chainId: number, amount: number) => {
    try {
      const contract = getContract({
        address: getAddress(pointsEmitterContract),
        abi: revolutionPointsEmitterAbi,
        client: { public: getClient(chainId) },
      });

      const tokens = await contract.read.getTokenQuoteForPayment([BigInt(amount)]);
      return tokens.toString();
    } catch (e) {
      console.error(e);
      reportApiError(e, { pointsEmitterContract, chainId, amount }, "get-governance-token-quote");
      return null;
    }
  },
  undefined,
  { revalidate: 600 },
);

export const getGovernanceTokenCost = unstable_cache(
  async (pointsEmitterContract: string, chainId: number, amount: number) => {
    try {
      const contract = getContract({
        address: getAddress(pointsEmitterContract),
        abi: revolutionPointsEmitterAbi,
        client: { public: getClient(chainId) },
      });

      const tokens = await contract.read.buyTokenQuote([BigInt(amount)]);
      return tokens.toString();
    } catch (e) {
      console.error(e);
      reportApiError(e, { pointsEmitterContract, chainId, amount }, "get-governance-token-quote");
      return null;
    }
  },
  undefined,
  { revalidate: 600 },
);
