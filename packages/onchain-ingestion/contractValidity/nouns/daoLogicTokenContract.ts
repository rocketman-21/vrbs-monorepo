import { database } from "@cobuild/database";
import { getClientWithInfuraKey } from "@cobuild/libs/web3/viem/clients";
import { getContract } from "viem";
import { INFURA_INGESTION_KEY } from "../../consts";
import { nounsBuilderGovernorV1Abi, nounsDaoLogicV1Abi } from "../../web3/wagmi";

type TokenContractRes = `0x${string}` | null;

//checks if supplied address is valid for the nouns auction abi, if not returns null
export const nounsDAOLogicTokenContract = async (
  chainId: number,
  contractAddress: `0x${string}`,
  entityTrackerId: string,
): Promise<TokenContractRes> => {
  const contract = getContract({
    address: contractAddress,
    abi: nounsDaoLogicV1Abi,
    client: { public: getClientWithInfuraKey(chainId, INFURA_INGESTION_KEY) },
  });

  const nounsContract = (await contract.read.nouns()) as `0x${string}`;

  await database.entityTracker.update({
    where: {
      id: entityTrackerId,
    },
    data: {
      details: {
        tokenContract: nounsContract as `0x${string}`,
      },
    },
  });

  return nounsContract;
};

//checks if supplied address is valid for the nouns auction abi, if not returns null
export const builderDAOGovernorTokenContract = async (
  chainId: number,
  contractAddress: `0x${string}`,
  entityTrackerId: string,
): Promise<TokenContractRes> => {
  const contract = getContract({
    address: contractAddress,
    abi: nounsBuilderGovernorV1Abi,
    client: { public: getClientWithInfuraKey(chainId, INFURA_INGESTION_KEY) },
  });

  const nounsContract = (await contract.read.token()) as `0x${string}`;

  await database.entityTracker.update({
    where: {
      id: entityTrackerId,
    },
    data: {
      details: {
        tokenContract: nounsContract as `0x${string}`,
      },
    },
  });

  return nounsContract;
};
