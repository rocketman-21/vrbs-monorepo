import { revolutionTokenAbi } from "@cobuild/revolution";
import { getContract } from "viem";
import { downloadNFTStorageFile } from "../../../storage/Pinata";
import { getClient } from "../clients";

interface IContractURIData {
  uri: string;
  parsed: any;
}

export async function getContractURIData(
  tokenContract: `0x${string}`,
  chainId: number,
): Promise<IContractURIData | null> {
  try {
    const contract = getContract({
      address: tokenContract,
      abi: revolutionTokenAbi,
      client: { public: getClient(chainId) },
    });

    const uri = await contract.read.contractURI();

    let parsed = null;

    if (uri.includes("ipfs://")) {
      parsed = await downloadNFTStorageFile(uri.split("ipfs://")[1]);
    } else if (uri.startsWith("data:application/json;base64,")) {
      const base64String = uri.split("data:application/json;base64,")[1];
      const jsonString = Buffer.from(base64String, "base64").toString("utf-8");
      try {
        parsed = JSON.parse(jsonString);
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
      }
    }

    return { uri, parsed };
  } catch (e) {
    console.error(e);
    return null;
  }
}
