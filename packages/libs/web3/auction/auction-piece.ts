import { revolutionTokenAbi } from "@cobuild/revolution";
import { getAddress, getContract } from "viem";
import { getClient } from "../viem/clients";

export async function getArtPieceById(tokenContract: string, chainId: number, tokenId: string) {
  const contract = getContract({
    address: getAddress(tokenContract),
    abi: revolutionTokenAbi,
    client: { public: getClient(chainId) },
  });
  const data = await contract.read.getArtPieceById([BigInt(tokenId)]);
  return data.pieceId.toString();
}
