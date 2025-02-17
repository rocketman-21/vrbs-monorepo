"use server";

import { getContract } from "viem";
import { cacheResult } from "../cache";
import { isEthAddress } from "../utils/account";
import { getCultureIndexAbi } from "../web3/revolution/cultureIndexAbi";
import { CultureIndexMediaType, CultureIndexRequiredMediaPrefix } from "../web3/revolution/types";
import { getClient } from "../web3/viem/clients";

export interface CultureIndexData {
  address: `0x${string}`;
  chainId: number;
  name: string;
  description: string;
  checklist: string;
  template: string;
  minVotingPowerToCreate: number;
  minVotingPowerToVote: number;
  quorumVotesBPS: number;
  quorumVotes: number;
  tokenVoteWeight: number;
  pointsVoteWeight: number;

  topVotedPieceId: number | null;

  // immutables
  MAX_NUM_CREATORS: number;
  MAX_NAME_LENGTH: number;
  MAX_DESCRIPTION_LENGTH: number;
  MAX_IMAGE_LENGTH: number;
  MAX_ANIMATION_URL_LENGTH: number;
  MAX_TEXT_LENGTH: number;
  VOTE_TYPEHASH: string;
  MAX_QUORUM_VOTES_BPS: number;

  // requirements
  requiredMediaType: CultureIndexMediaType;
  requiredMediaPrefix: CultureIndexRequiredMediaPrefix;
  requiresSvg: boolean;
}

// function to pull all the data from the contract
//get proxy contracts for token
export async function getCultureIndexData(address: `0x${string}`, chainId: number) {
  if (!isEthAddress(address)) throw new Error(`Invalid CultureIndex address: ${address}`);

  return cacheResult(
    `culture-index-data-${address}-${chainId}`,
    Math.floor(Math.random() * 360) + 360,
    async () => {
      return await cultureIndexData(address, chainId);
    },
  );
}

const cultureIndexData = async (
  address: `0x${string}`,
  chainId: number,
): Promise<CultureIndexData> => {
  const contract = getContract({
    address,
    abi: getCultureIndexAbi("v1"),
    client: { public: getClient(chainId) },
  });

  const minVotingPowerToCreate = await cacheResult(
    `minVotingPowerToCreate_${contract.address}`,
    86400,
    async () => Number(await contract.read.minVotingPowerToCreate()),
  );
  const minVotingPowerToVote = await cacheResult(
    `minVotingPowerToVote_${contract.address}`,
    86400,
    async () => Number(await contract.read.minVotingPowerToVote()),
  );
  const quorumVotesBPS = await cacheResult(`quorumVotesBPS_${contract.address}`, 86400, async () =>
    Number(await contract.read.quorumVotesBPS()),
  );
  const quorumVotes = await cacheResult(`quorumVotes_${contract.address}`, 86400, async () =>
    Number(await contract.read.quorumVotes()),
  );

  const [
    maxNumCreators,
    PIECE_DATA_MAXIMUMS,
    VOTE_TYPEHASH,
    MAX_QUORUM_VOTES_BPS,
    tokenVoteWeight,
    pointsVoteWeight,
    requiredMediaType,
    requiredMediaPrefix,
    template,
    checklist,
    name,
    description,
  ] = await Promise.all([
    cacheResult(`MAX_NUM_CREATORS_${contract.address}`, 604800, async () =>
      Number(await contract.read.MAX_NUM_CREATORS()),
    ),
    cacheResult(`PIECE_DATA_MAXIMUMS_${contract.address}`, 604800, async () =>
      (await contract.read.PIECE_DATA_MAXIMUMS()).map(Number),
    ),
    cacheResult(
      `VOTE_TYPEHASH_${contract.address}`,
      604800,
      async () => await contract.read.VOTE_TYPEHASH(),
    ),
    cacheResult(`MAX_QUORUM_VOTES_BPS_${contract.address}`, 604800, async () =>
      Number(await contract.read.MAX_QUORUM_VOTES_BPS()),
    ),
    cacheResult(`tokenVoteWeight_${contract.address}`, 604800, async () =>
      Number(await contract.read.tokenVoteWeight()),
    ),
    cacheResult(`pointsVoteWeight_${contract.address}`, 604800, async () =>
      Number(await contract.read.pointsVoteWeight()),
    ),
    cacheResult(`requiredMediaType_${contract.address}`, 604800, async () =>
      Number(await contract.read.requiredMediaType()),
    ),
    cacheResult(`requiredMediaPrefix_${contract.address}`, 604800, async () =>
      Number(await contract.read.requiredMediaPrefix()),
    ),
    cacheResult(`template_${contract.address}`, 604800, async () => await contract.read.template()),
    cacheResult(
      `checklist_${contract.address}`,
      604800,
      async () => await contract.read.checklist(),
    ),
    cacheResult(`name_${contract.address}`, 604800, async () => await contract.read.name()),
    cacheResult(
      `description_${contract.address}`,
      604800,
      async () => await contract.read.description(),
    ),
  ]);

  let topVotedPieceId = null;

  try {
    topVotedPieceId = await contract.read.topVotedPieceId();
  } catch (e) {}

  return {
    address: address.toLowerCase() as `0x${string}`,
    chainId,
    name,
    description,
    template,
    checklist: checklist.trim(),
    requiresSvg: requiredMediaPrefix === CultureIndexRequiredMediaPrefix.SVG,
    quorumVotesBPS: Number(quorumVotesBPS),
    quorumVotes: Number(quorumVotes),
    topVotedPieceId: topVotedPieceId ? Number(topVotedPieceId) : null,
    minVotingPowerToCreate: Number(minVotingPowerToCreate),
    minVotingPowerToVote: Number(minVotingPowerToVote),
    tokenVoteWeight: Number(tokenVoteWeight),
    pointsVoteWeight: Number(pointsVoteWeight),
    MAX_NUM_CREATORS: Number(maxNumCreators),
    MAX_NAME_LENGTH: Number(PIECE_DATA_MAXIMUMS[0]),
    MAX_DESCRIPTION_LENGTH: Number(PIECE_DATA_MAXIMUMS[1]),
    MAX_IMAGE_LENGTH: Number(PIECE_DATA_MAXIMUMS[2]),
    MAX_TEXT_LENGTH: Number(PIECE_DATA_MAXIMUMS[3]),
    MAX_ANIMATION_URL_LENGTH: Number(PIECE_DATA_MAXIMUMS[4]),
    VOTE_TYPEHASH,
    MAX_QUORUM_VOTES_BPS: Number(MAX_QUORUM_VOTES_BPS),
    requiredMediaType: Number(requiredMediaType),
    requiredMediaPrefix: Number(requiredMediaPrefix),
  };
};
