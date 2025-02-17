import "server-only";

import { Pool as AlloPoolData } from "@allo-team/allo-v2-sdk/dist/Allo/types";
import { Profile as AlloProfile } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import { serialize } from "@cobuild/libs/utils/data";
import { alloClient } from "@cobuild/libs/web3/allo/allo";
import { alloRegistry } from "@cobuild/libs/web3/allo/registry";
import uniq from "lodash/uniq";
import { AlloPool } from "prisma-database";
import { IPool } from "./IPool";

export async function transformPool(pool: AlloPool): Promise<IPool> {
  const alloPoolData: AlloPoolData = await getAlloPoolData(pool);

  const ownerProfile: AlloProfile = await getAlloProfile(alloPoolData.profileId, pool.chainId);

  const managers = uniq(
    [ownerProfile.owner, ...pool.managers].map(a => a.toLowerCase()),
  ) as `0x${string}`[];

  return Object.assign(pool, {
    ...alloPoolData,
    url: `/${pool.revolutionId}/pools/${pool.chainId}/${pool.alloPoolId}`,
    managers,
    ownerProfile,
    strategy: alloPoolData.strategy.toLowerCase() as `0x${string}`,
  });
}

async function getAlloPoolData(pool: AlloPool): Promise<AlloPoolData> {
  const profile = await alloClient.getPool(BigInt(pool.alloPoolId));

  return serialize(profile);
}

async function getAlloProfile(profileId: `0x${string}`, chainId: number): Promise<AlloProfile> {
  const profile = await alloRegistry.getProfileById(profileId);

  return serialize(profile);
}
