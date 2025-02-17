import { createContractTopic0sForAbi } from "@cobuild/libs/web3/abiParse";
import {
  fetchContractName,
  getContractCreationDetails,
} from "@cobuild/libs/web3/explorer-api/explorerApi";
import omit from "lodash/omit";
import { EntityTracker, TrackerType } from "prisma-database";
import { cache } from "react";
import "server-only";
import { AbiItem } from "viem";
import { database } from "../..";
import { EventTrackers } from "./EventTrackers";
import { mainnet } from "viem/chains";
import { shortenIfEthAddress } from "@cobuild/libs/utils/account";

export enum AuctionEntityContractNames {
  Token = "NounsToken",
  Auction = "NounsAuctionHouseProxy",
}

export function EntityTrackers() {
  return Object.assign(database.entityTracker, {
    getEntityTracker,
    getTrackersByTypeForIngestion,
    updateLastScannedBlock,
    updateLastPickedUpWorkOn,
    getTrackerForAuction,
    createEntityTracker,
    getTrackerByTypeAndContractAddress,
  });
}

const getTrackerForAuction = cache(
  async (
    auctionContract: string,
    tokenContract: string,
    chainId: number,
  ): Promise<EntityTracker | null> => {
    const trackers: EntityTracker[] = (await database.entityTracker.aggregateRaw({
      pipeline: [
        {
          $match: { chainId, "contracts.address": tokenContract },
        },
      ],
    })) as any;

    const tracker = trackers.find(tracker => {
      const auctionContractInTracker = tracker.contracts.find(
        contract => contract.address === auctionContract,
      );

      return auctionContractInTracker !== undefined;
    });

    return tracker ?? null;
  },
);

const getEntityTracker = cache(async (id: string): Promise<EntityTracker | null> => {
  return database.entityTracker.findUnique({ where: { id } });
});

//only get trackers that are enabled and lastPickedUpWorkOn is null or more than 30 sec ago
const getTrackersByTypeForIngestion = (
  trackerType: TrackerType,
  contractAddress?: `0x${string}`,
): Promise<EntityTracker[]> => {
  return database.entityTracker.findMany({
    where: {
      trackerType,
      ...(contractAddress ? { contract: contractAddress.toLowerCase() } : {}), //if contractAddress is null, then
      lastPickedUpWorkOn: {
        lte: new Date(Date.now() - 30 * 1000),
      },
      disabled: false,
    },
    orderBy: {
      lastPickedUpWorkOn: "asc",
    },
  });
};

//getTrackerByTypeAndContractAddress
const getTrackerByTypeAndContractAddress = cache(
  async (
    trackerType: TrackerType,
    contractAddress: `0x${string}`,
  ): Promise<EntityTracker | null> => {
    return database.entityTracker.findFirst({
      where: {
        trackerType,
        contract: contractAddress.toLowerCase(),
      },
    });
  },
);

const updateLastScannedBlock = cache(
  async (id: string, lastScannedBlock: number): Promise<void> => {
    await database.entityTracker.update({
      where: { id },
      data: { lastScannedBlock },
    });
  },
);

//update last picked up work on
const updateLastPickedUpWorkOn = cache(
  async (id: string, lastPickedUpWorkOn: Date): Promise<void> => {
    await database.entityTracker.update({
      where: { id },
      data: { lastPickedUpWorkOn },
    });
  },
);

const createEntityTracker = async (
  userAddress: `0x${string}` | null,
  contractAddress: `0x${string}`,
  trackerType: TrackerType,
  chainId: number,
  implementationContract: string,
  abi: AbiItem[],
): Promise<number> => {
  const implementationContractName = await fetchContractName(
    chainId as any,
    implementationContract,
  );
  const interfaceContractName = await fetchContractName(chainId as any, contractAddress);
  const contractName = implementationContractName || interfaceContractName;

  //todo still need some kind of verification of contract -> implementation
  const contractTopic0s = createContractTopic0sForAbi(
    contractAddress,
    contractName,
    abi,
    implementationContract,
  );

  let creationBlock = chainId === mainnet.id ? 14036721 : 0;

  try {
    const details = await getContractCreationDetails(chainId as any, contractAddress);
    creationBlock = Number(details.creationBlockNumber);
  } catch (e) {
    console.error(e);
  }

  //ingest the topic0s as eventtrackers if they're not found in our db already!
  await EventTrackers().getMinTrackedBlockByTopics(chainId, contractTopic0s, Number(creationBlock));

  const newEntityTracker: Omit<EntityTracker, "id"> = {
    contract: contractAddress.toLowerCase(),
    trackerType,
    contracts: [
      {
        address: contractAddress.toLowerCase(),
        name: contractName || shortenIfEthAddress(contractAddress),
      },
    ],
    chainId,
    contractTopic0s,
    blockJump: 5000,
    startBlock: Number(creationBlock),
    lastScannedBlock: Number(creationBlock),
    disabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: userAddress,
    name: contractName || shortenIfEthAddress(contractAddress),
    details: null,
    //2 minutes ago
    lastPickedUpWorkOn: new Date(Date.now() - 1000 * 60 * 2),
  };

  //insert new entityTracker for the contract
  await database.entityTracker.upsert({
    where: {
      contract_trackerType: { contract: contractAddress.toLowerCase(), trackerType },
    },
    create: newEntityTracker,
    update: omit(newEntityTracker, [
      "createdAt",
      "author",
      "disabled",
      "lastPickedUpWorkOn",
      "lastScannedBlock",
      "blockJump",
      "details",
    ]),
  });

  return newEntityTracker.startBlock;
};
