import { Blocks } from "@cobuild/database/models/eth/Blocks";
import { INFURA_INGESTION_KEY } from "../consts";

const DEFAULT_BLOCK_JUMP = 5000;

export interface BlockRange {
  start: number;
  end: number;
}

export const getBlockTimestampForIngestion = async (
  chainId: number,
  blockNumber: number | bigint,
) => Blocks().getBlockTimestamp(blockNumber, chainId, INFURA_INGESTION_KEY);

export const calculateBlockRange = async (
  lastScannedBlockEntity: number,
  earliestTrackedTopicBlock: number,
  chainId: number,
  blockJump = DEFAULT_BLOCK_JUMP,
): Promise<BlockRange> => {
  const mostRecentBlock = await Blocks().getLatestBlockNumber(chainId);
  const startAtBlock = Math.min(earliestTrackedTopicBlock, lastScannedBlockEntity);

  //either the min of end of the block jump
  //or the earliest tracked topic block
  //or the most recent block
  let endAtBlock = Math.min(
    startAtBlock + blockJump,
    earliestTrackedTopicBlock,
    mostRecentBlock || 0,
  );

  return { start: startAtBlock, end: endAtBlock };
};
