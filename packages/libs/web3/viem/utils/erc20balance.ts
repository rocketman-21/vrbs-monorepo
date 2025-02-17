import { unstable_cache } from "next/cache";
import { formatEther, getContract } from "viem";
import { erc20Abi } from "viem";
import { getClient } from "../clients";
import { cacheResult } from "../../../cache";

export async function getErc20TokenBalance(owner: string, address: `0x${string}`, chainId: number) {
  try {
    const contract = getContract({
      address: address as `0x${string}`,
      abi: erc20Abi,
      client: { public: getClient(chainId) },
    });

    // no need to promise.all, will use batch.multicall
    const balance = await contract.read.balanceOf([owner as `0x${string}`]);
    const symbol = await contract.read.symbol();
    const decimals = await contract.read.decimals();

    return Number(isEther(symbol) ? formatEther(balance) : Number(balance) / 10 ** decimals);
  } catch (e) {
    console.error(e);
    //todo handle this better
    return 0;
  }
}

export const getErc20TokenSymbol = unstable_cache(
  async (address: `0x${string}`, chainId: number) => {
    try {
      const contract = getContract({
        address: address as `0x${string}`,
        abi: erc20Abi,
        client: { public: getClient(chainId) },
      });
      const [symbol, name] = await Promise.all([
        cacheResult(`symbol_${contract.address}`, 2592000, async () => contract.read.symbol()),
        cacheResult(`name_${contract.address}`, 2592000, async () => contract.read.name()),
      ]);

      return { symbol, name };
    } catch (e) {
      console.error(e);
      return { symbol: "", name: "" };
    }
  },
  undefined,
  { revalidate: 3600, tags: ["token-symbol"] },
);

const ethSymbols = ["eth", "steth", "steth2", "wsteth", "weth", "reth", "reth2"];

function isEther(symbol: string) {
  return ethSymbols.includes(symbol.toLowerCase());
}
