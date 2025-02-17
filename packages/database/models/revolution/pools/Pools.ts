import { cacheResult } from "@cobuild/libs/cache";
import { getClient } from "@cobuild/libs/web3/viem/clients";
import { revolutionGrantsAbi } from "@cobuild/revolution";
import { Prisma } from "prisma-database";
import { erc20Abi, getContract } from "viem";
import { base } from "viem/chains";
import { database } from "../../..";
import { IGrantVote } from "../grants/IGrant";
import { VRBS_GRANTS_PROXY } from "../revolutions/addresses";
import { transformPool } from "./Pool";

export function Pools() {
  return {
    getById,
    getForRevolution,
    countForRevolution,
    create,
    getVrbsSuperfluidPool,
    getVotesForUser,
  };
}

async function getForRevolution(revolutionId: string) {
  const pools = await database.alloPool.findMany({ where: { revolutionId } });
  return await Promise.all(pools.map(transformPool));
}

async function countForRevolution(revolutionId: string) {
  return await database.alloPool.count({ where: { revolutionId } });
}

async function getById(alloPoolId: string, chainId: number) {
  const pool = await database.alloPool.findUnique({
    where: { chainId_alloPoolId: { alloPoolId, chainId } },
  });
  return pool ? transformPool(pool) : null;
}

async function getVotesForUser(
  address: `0x${string}`,
  contractAddress: `0x${string}`,
): Promise<IGrantVote[]> {
  const chainId = base.id; //todo update
  const client = getClient(chainId);

  const contract = getContract({
    address: contractAddress,
    abi: revolutionGrantsAbi,
    client,
  });

  const votes = await contract.read.getVotesForAccount([address]);

  return votes.map(vote => ({
    recipient: vote.recipient.toLowerCase() as `0x${string}`,
    bps: Number(vote.bps),
    memberUnitsDelta: Number(vote.memberUnits),
  }));
}

async function getVrbsSuperfluidPool() {
  const chainId = base.id; //todo update
  const client = getClient(chainId);

  const contract = getContract({
    address: VRBS_GRANTS_PROXY,
    abi: revolutionGrantsAbi,
    client,
  });

  const [totalFlowRate, totalUnits, superToken] = await Promise.all([
    cacheResult(`totalFlowRate_${chainId}`, 3600, async () => {
      return Number(await contract.read.getTotalFlowRate());
    }),
    cacheResult(`totalUnits_${chainId}`, 3600, async () => {
      return Number(await contract.read.getTotalUnits());
    }),
    cacheResult(`superToken_${chainId}`, 604800, async () => {
      return await contract.read.superToken();
    }),
  ]);

  const erc20 = getContract({ address: superToken, abi: erc20Abi, client });

  const balance = await cacheResult(`balance_${VRBS_GRANTS_PROXY}`, 600, async () => {
    return Number(await erc20.read.balanceOf([VRBS_GRANTS_PROXY]));
  });

  return {
    totalFlowRate,
    totalUnits,
    balance,
    monthlyFlowRate: totalFlowRate * 60 * 60 * 24 * 30,
  };
}

async function create(data: Prisma.AlloPoolCreateInput) {
  const pool = await database.alloPool.create({ data });
  return transformPool(pool);
}
