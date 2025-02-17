import "server-only";

import { unstable_cache } from "next/cache";
import { formatEther } from "viem";
import { polygon } from "viem/chains";
import { convertPrice, convertToEth, getConversionRates } from "../utils/price/getCoinPrice";
import { getCurrencyFromChainId } from "./currency";
import { getClient } from "./viem/clients";
import { getErc20TokenBalance, getErc20TokenSymbol } from "./viem/utils/erc20balance";

export type TreasuryBalance = {
  address: `0x${string}`;
  balance: number;
  chainId: number;
  symbol: string;
  contractAddress?: string;
};

export async function getAddressBalance(address: `0x${string}`, chainId: number): Promise<number> {
  const client = getClient(chainId);
  const balance = await client.getBalance({ address: address as `0x${string}` });

  if (chainId === polygon.id) {
    const conversionRates = await getConversionRates();

    return (convertToEth(conversionRates, chainId, Number(formatEther(balance))) || 0) as number;
  }

  return Number(formatEther(balance));
}

export const getDaoTreasuryBalance = unstable_cache(
  async (
    vaults: { address: `0x${string}`; chainId: number }[],
    tokens: { address: `0x${string}`; chainId: number }[] = [],
  ): Promise<TreasuryBalance[]> => {
    const vaultsBalance = await Promise.all(
      vaults.map(async v => ({
        ...v,
        balance: await getAddressBalance(v.address, v.chainId),
        symbol: getCurrencyFromChainId(v.chainId).toUpperCase(),
      })),
    );

    const contractsBalance = await Promise.all(
      vaults
        .map(vault =>
          tokens.map(async t => {
            return {
              ...vault,
              contractAddress: t.address,
              balance: await getErc20TokenBalance(vault.address, t.address, t.chainId),
              symbol: (await getErc20TokenSymbol(t.address, t.chainId)).symbol,
            };
          }),
        )
        .flatMap(d => d),
    );

    return [...vaultsBalance, ...contractsBalance];
  },
  undefined,
  { revalidate: 600, tags: ["dao-treasury-balance"] },
);

export async function getBalanceInEth(balances: TreasuryBalance[]): Promise<number> {
  const ethBalances = await Promise.all(
    balances.map(async b => {
      switch (b.symbol.toLowerCase()) {
        case "eth":
          return b.balance;
        case "usdc":
          return Number(await convertPrice(b.balance, "usd", "eth", false)) || 0;
        case "matic":
          return Number(await convertPrice(b.balance, "matic", "eth", false)) || 0;
        default:
          return 0;
      }
    }),
  );

  return ethBalances.reduce((a, b) => a + b, 0);
}
