import { unstable_cache } from "next/cache";
import { Prisma } from "prisma-database";
import { cache } from "react";
import { formatEther } from "viem";
import { database } from "../../..";
import { serializeMany } from "../../../utils";
import { VRBS_GRANTS_PROXY } from "../revolutions/addresses";
import { transformGrant } from "./Grant";
import { IGrant } from "./IGrant";

export function Grants() {
  return {
    getById,
    getAll,
    getTopLevel,
    getOpportunities,
    getOpenPools,
    countForRevolution,
    create,
    getAllForParentContract,
    countBuilders,
    countOpportunities,
    getTotalEarnedForGrants,
    getForUser,
    getImpactGrants,
  };
}

const getAll = unstable_cache(
  async (revolutionId: string) => {
    const grants = await database.alloProfile.findMany({
      where: { revolutionId },
    });
    return await Promise.all(grants.map(transformGrant));
  },
  undefined,
  { revalidate: 120 },
);

// allo profile ids
const PUBLIC_SPACES = "0x34ef3d7fa915c0be73b67d9d849b6fe89afe6633c7034eb5cb7e7c046d38071a";
const HELP_PEOPLE_IN_NEED = "0x87dfa6856efe87fa9784e8b53d409d64a9b5cec94b56bd5669bad089470c1c14";
const ARTISTS_RESIDENCY = "0x0f5dfbfce6705a6c5fd07a9c8342fdb70da996bc6ee5a020668fcda97d58f9ad";

const getImpactGrants = unstable_cache(
  async (revolutionId: string) => {
    const grants = await database.alloProfile.findMany({
      where: {
        revolutionId,
        OR: [
          { alloProfileId: HELP_PEOPLE_IN_NEED },
          { alloProfileId: PUBLIC_SPACES },
          { alloProfileId: ARTISTS_RESIDENCY },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return await Promise.all(
      grants
        .map(g => ({ ...g, title: g.title.replace("Artists Residency", "Support artists") }))
        .map(transformGrant),
    );
  },
  undefined,
  { revalidate: 1800 },
);

const getTopLevel = cache(async (revolutionId: string) => {
  const grants = await database.alloProfile.findMany({
    where: { revolutionId, parentGrantsContract: VRBS_GRANTS_PROXY },
  });
  return (await Promise.all(grants.map(transformGrant))).sort(
    (a, b) => b.totalVotes - a.totalVotes,
  );
});

const getAllForParentContract = cache(async (parentGrantsContract: `0x${string}`) => {
  const grants = await database.alloProfile.findMany({
    where: { parentGrantsContract },
  });
  return (await Promise.all(grants.map(transformGrant))).sort(g => (g.isApproved ? -1 : 1));
});

const countForRevolution = unstable_cache(
  async (revolutionId: string) => {
    return database.alloProfile.count({
      where: { revolutionId, OR: [{ isApplication: false }, { isApplication: { isSet: false } }] },
    });
  },
  undefined,
  { revalidate: 60 * 60 * 6 },
);

const getTotalEarnedForGrants = unstable_cache(
  async (parentGrantsContract: `0x${string}`) => {
    const grants = await getAllForParentContract(parentGrantsContract);
    return grants.reduce(
      (total, grant) => total + Number(formatEther(BigInt(grant.poolBalance.totalEarned))),
      0,
    );
  },
  undefined,
  { revalidate: 60 * 60 * 12 },
);

const getOpportunities = unstable_cache(
  async (revolutionId: string): Promise<IGrant[]> => {
    const grants = await database.alloProfile.findMany({
      where: { revolutionId, isApplicable: true },
      orderBy: { createdAt: "desc" },
    });

    return (await Promise.all(grants.map(transformGrant))).filter(g => g.openings > 0);
  },
  undefined,
  { revalidate: 180 },
);

const countOpportunities = unstable_cache(
  async (revolutionId: string): Promise<number> => {
    return database.alloProfile.count({
      where: {
        revolutionId,
        contractAddress: { not: null },
      },
    });
  },
  undefined,
  { revalidate: 60 * 60 * 6 },
);

const countBuilders = unstable_cache(
  async (revolutionId: string): Promise<number> => {
    const grants = await database.alloProfile.findMany({
      where: { revolutionId },
      select: { team: true },
    });

    const teamMembers = grants.flatMap(grant => grant.team);
    const uniqueTeamMembers = new Set(teamMembers);

    return uniqueTeamMembers.size;
  },
  undefined,
  { revalidate: 60 * 60 * 24 },
);

const getById = cache(async (alloProfileId: string, chainId: number) => {
  const grant = await database.alloProfile.findUnique({
    where: { chainId_alloProfileId: { alloProfileId, chainId } },
  });
  return grant ? transformGrant(grant) : null;
});

async function create(data: Prisma.AlloProfileCreateInput) {
  const grant = await database.alloProfile.create({ data });
  return transformGrant(grant);
}

const getOpenPools = unstable_cache(
  async (revolutionId: string): Promise<IGrant[]> => {
    const grants = await database.alloProfile.findMany({
      where: {
        revolutionId,
        contractAddress: { not: null },
        OR: [{ isApplicable: false }, { isApplicable: { isSet: false } }],
      },
    });
    return await Promise.all(grants.map(transformGrant));
  },
  undefined,
  { revalidate: 600 },
);

const getForUser = unstable_cache(
  async (revolutionId: string, user: `0x${string}` | null) => {
    if (!user) return [];

    const grants = await database.alloProfile.findMany({
      where: {
        revolutionId,
        team: { has: user },
        OR: [{ isApplicable: false }, { isApplicable: { isSet: false } }],
      },
    });

    return await serializeMany(
      (await Promise.all(grants.map(transformGrant))).filter(g => !g.isOpenGrantPool),
      ["isMemberConnectedToPool"],
    );
  },
  undefined,
  { revalidate: 600 },
);
