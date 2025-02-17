import { database } from "@cobuild/database";
import { getClientWithInfuraKey } from "@cobuild/libs/web3/viem/clients";
import { auctionHouseAbi } from "@cobuild/revolution";
import { getContract } from "viem";
import { INFURA_INGESTION_KEY } from "../../consts";
import { nounsAuctionHouseAbi, skateContractV2AuctionHouseV2Abi } from "../../web3/wagmi";

type TokenContractRes = `0x${string}` | null;

//checks if supplied address is valid for the nouns auction abi, if not returns null
export const nounsAuctionTokenContract = async (
  chainId: number,
  contractAddress: `0x${string}`,
  entityTrackerId: string,
): Promise<TokenContractRes> => {
  const contract = getContract({
    address: contractAddress,
    abi: nounsAuctionHouseAbi,
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

export const gnarsAuctionTokenContract = async (
  chainId: number,
  contractAddress: `0x${string}`,
  entityTrackerId: string,
): Promise<TokenContractRes> => {
  const contract = getContract({
    address: contractAddress,
    abi: skateContractV2AuctionHouseV2Abi,
    client: { public: getClientWithInfuraKey(chainId, INFURA_INGESTION_KEY) },
  });

  const gnarsContract = (await contract.read.gnars()).toLowerCase() as `0x${string}`;

  await database.entityTracker.update({
    where: {
      id: entityTrackerId,
    },
    data: {
      details: {
        tokenContract: gnarsContract as `0x${string}`,
      },
    },
  });

  return gnarsContract;
};

export const revolutionAuctionTokenContract = async (
  chainId: number,
  contractAddress: `0x${string}`,
  entityTrackerId: string,
): Promise<TokenContractRes> => {
  const contract = getContract({
    address: contractAddress,
    abi: auctionHouseAbi,
    client: { public: getClientWithInfuraKey(chainId, INFURA_INGESTION_KEY) },
  });

  const tokenContract = (await contract.read.revolutionToken()).toLowerCase() as `0x${string}`;

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
