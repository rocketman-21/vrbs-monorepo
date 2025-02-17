import { AbiItem, getEventSelector } from "viem";
import { ContractTopic0 } from "prisma-database";
import { shortenIfEthAddress } from "../utils/account";

export const createContractTopic0sForAbi = (
  contractAddress: `0x${string}`,
  contractName: string,
  abi: AbiItem[],
  implementationContract: string,
): ContractTopic0[] => {
  const topic0s: ContractTopic0[] = [];

  for (let item of abi) {
    if (item.type === "event") {
      const eventName = item.name;
      // Assuming getEventSelector generates the topic0 for an event based on its name and inputs
      const topic0 = getEventSelector({
        type: "event",
        name: eventName,
        inputs: item.inputs,
      });
      topic0s.push({
        topic0,
        contractName: contractName || shortenIfEthAddress(contractAddress),
        contract: contractAddress.toLowerCase(),
        eventName,
        implementationContract: implementationContract.toLowerCase(),
      });
    }
  }

  return topic0s;
};
