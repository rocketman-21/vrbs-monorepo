import { database } from "@cobuild/database";
import { Blocks } from "@cobuild/database/models/eth/Blocks";
import { reportIngestionError } from "@cobuild/libs/utils/ingestionError";
import { getClientWithInfuraKey } from "@cobuild/libs/web3/viem/clients";
import { OnchainEvent } from "prisma-database";
import { Abi, AbiItem, PublicClient } from "viem";
import { INFURA_INGESTION_KEY } from "../consts";
import { getAbiForImplementation } from "./utils/AbiMapping";
import { saveEvents } from "./utils/bulkwriteEvents";
import { parseLog } from "./utils/parseLog";

//while eventTracker is not caught up, run loop on ingestEventsForTopic0
export const ingestEventTracker = async (
  topic0: string,
  chainId: number,
  implementationContract: string,
  contract?: `0x${string}`,
) => {
  const eventTracker = await getEventTracker(topic0, chainId, contract);

  let lastScannedBlock = eventTracker.lastScannedBlock;
  const mostRecentBlock = await Blocks().getLatestBlockNumber(chainId);

  console.log({ lastScannedBlock, mostRecentBlock });
  while (lastScannedBlock < mostRecentBlock) {
    await ingestEventsForTopic0(topic0, chainId, implementationContract, contract);
    lastScannedBlock = (await getEventTracker(topic0, chainId, contract)).lastScannedBlock;
  }
};

const ingestEventsForTopic0 = async (
  topic0: string,
  chainId: number,
  implementationContract: string,
  contract?: `0x${string}`,
  retry: boolean = true,
) => {
  try {
    const client = getClientWithInfuraKey(chainId, INFURA_INGESTION_KEY);

    const eventTracker = await getEventTracker(topic0, chainId, contract);
    const { lastScannedBlock, name: eventName, blockJump } = eventTracker;
    const abi = await getAbiForImplementation(implementationContract, chainId);

    //check if event exists in abi
    getAbiEvent(abi, eventName);

    const { logs, lastScannedBlock: newLastScannedBlock } = await fetchContractEvents(
      client,
      chainId,
      abi,
      eventName,
      BigInt(lastScannedBlock),
      blockJump,
      contract,
    );

    const events = (await Promise.all(
      logs.map(log => parseLog(log, chainId, eventName, abi)).filter(Boolean),
    )) as OnchainEvent[];

    const totalUpserted = await saveEvents(events);

    await database.eventTracker.update({
      where: { chainId, topic0 },
      data: {
        lastScannedBlock: Number(newLastScannedBlock),
        totalUpserted: (eventTracker.totalUpserted || 0) + totalUpserted,
      },
    });
  } catch (error) {
    await handleIngestionError(error, retry, topic0, chainId, implementationContract, contract);
  }
};

const getEventTracker = async (topic0: string, chainId: number, contract?: `0x${string}`) => {
  const eventTracker = await database.eventTracker.findFirst({
    where: {
      chainId,
      topic0,
      OR: [{ contract: { isSet: false } }, { contract: !!contract ? contract : null }],
    },
  });

  if (!eventTracker)
    throw new Error(
      `No event tracker found for topic0 ${topic0} and chainId ${chainId} and contract ${contract}`,
    );

  return eventTracker;
};

const getAbiEvent = (abi: Abi, eventName: string): AbiItem => {
  const abiItem = abi.find(item => isAbiEvent(item) && (item as any).name === eventName);

  if (!abiItem) throw new Error("No inputs for abi item");

  return abiItem;
};

const fetchContractEvents = async (
  client: PublicClient,
  chainId: number,
  abi: Abi,
  eventName: string,
  fromBlock: bigint,
  blockJump: number,
  contract?: `0x${string}`,
) => {
  const mostRecentBlockNumber = await Blocks().getLatestBlockNumber(chainId || 1);

  const toBlock = Math.min(Number(fromBlock + BigInt(blockJump)), mostRecentBlockNumber);
  const events = await client.getContractEvents({
    abi,
    eventName,
    strict: true,
    address: contract ? contract : undefined,
    fromBlock: BigInt(fromBlock),
    toBlock: BigInt(toBlock),
  });

  console.log(
    `fetched ${events.length} events for ${eventName} from ${fromBlock} to ${toBlock} with contract ${contract}`,
  );

  return { logs: events, lastScannedBlock: toBlock };
};

const handleIngestionError = async (
  error: any,
  retry: boolean,
  topic0: string,
  chainId: number,
  implementationContract: string,
  contract?: `0x${string}`,
) => {
  console.error({ error: error.message });

  reportIngestionError(
    error.message,
    JSON.stringify({ chainId, implementationContract, topic0 }),
    "func-ingestEventsForTopic0",
  );

  if (
    retry &&
    (error.message.includes("query returned more than 10000 results") ||
      error.message.includes("query timeout exceeded"))
  ) {
    const eventTracker = await getEventTracker(topic0, chainId);
    const newBlockJump = Math.ceil(eventTracker.blockJump / 2);

    await database.eventTracker.update({
      where: { chainId, topic0 },
      data: { blockJump: Math.max(newBlockJump, 1) },
    });

    return await ingestEventsForTopic0(topic0, chainId, implementationContract, contract, false);
  }

  throw error;
};

const isAbiEvent = (item: AbiItem) => item.type === "event";
