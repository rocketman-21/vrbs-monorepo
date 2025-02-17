import { getContract, parseEther } from "viem";
import { base } from "viem/chains";
import { getClient } from "../viem/clients";
import { zoraCreatorFixedPriceSaleStrategyAbi, zoraTimedSaleStrategyAbi } from "../wagmi";

export interface ISaleConfig {
  saleStart: string;
  saleEnd: string;
  maxTokensPerAddress: string;
  pricePerToken: string;
  fundsRecipient: `0x${string}`;
  // zora v2
  erc20zAddress: `0x${string}`;
  poolAddress: `0x${string}`;
}

export async function getSaleConfig(
  address: `0x${string}`,
  chainId: number,
  tokenId: string | number,
): Promise<ISaleConfig> {
  if (chainId !== base.id) {
    throw new Error(`Unknown address for Zora Sale Strategy contract on ${chainId} chain`);
  }

  const contract = getContract({
    address: "0x04e2516a2c207e84a1839755675dfd8ef6302f0a",
    client: { public: getClient(chainId) },
    abi: zoraCreatorFixedPriceSaleStrategyAbi,
  });

  const timedSaleStrategy = getContract({
    address: "0x777777722d078c97c6ad07d9f36801e653e356ae",
    client: { public: getClient(chainId) },
    abi: zoraTimedSaleStrategyAbi,
  });

  const sale = await contract.read.sale([address, BigInt(tokenId)]);
  const timedSale = await timedSaleStrategy.read.sale([address, BigInt(tokenId)]);

  const data = {
    // zora v1
    maxTokensPerAddress: sale.maxTokensPerAddress.toString(),
    pricePerToken: sale.pricePerToken.toString(),
    fundsRecipient: sale.fundsRecipient,
    // both
    saleStart: (sale.saleStart || timedSale.saleStart).toString(),
    saleEnd: (sale.saleEnd || timedSale.saleEnd).toString(),
    // zora v2
    erc20zAddress: timedSale.erc20zAddress,
    poolAddress: timedSale.poolAddress,
  };

  if (timedSale.erc20zAddress) {
    // fixed 111 sparks per mint per https://support.zora.co/en/articles/1368513
    data.pricePerToken = parseEther("0.000111").toString();
  }

  return data;
}
