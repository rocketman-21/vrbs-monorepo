import { getClientWithInfuraKey } from "@cobuild/libs/web3/viem/clients";

import { getContract } from "viem";
import { revolutionDaoLogicV1Abi, revolutionVotingPowerAbi } from "@cobuild/revolution";
import { database } from "@cobuild/database";
import { INFURA_INGESTION_KEY } from "../../../../../../consts";

//checks if supplied address is valid for the nouns auction abi, if not returns null
export const revolutionDaoTokenContract = async (
  chainId: number,
  contractAddress: `0x${string}`,
  entityTrackerId: string,
): Promise<`0x${string}` | null> => {
  const contract = getContract({
    address: contractAddress,
    abi: revolutionDaoLogicV1Abi,
    client: { public: getClientWithInfuraKey(chainId, INFURA_INGESTION_KEY) },
  });

  const votingPowerContractAddress = (await contract.read.votingPower()) as `0x${string}`;

  const votingPowerContract = getContract({
    address: votingPowerContractAddress,
    abi: revolutionVotingPowerAbi,
    client: { public: getClientWithInfuraKey(chainId, INFURA_INGESTION_KEY) },
  });

  const tokenContract = (await votingPowerContract.read.token()) as `0x${string}`;

  await database.entityTracker.update({
    where: {
      id: entityTrackerId,
    },
    data: {
      details: {
        tokenContract: tokenContract as `0x${string}`,
      },
    },
  });

  return tokenContract;
};
