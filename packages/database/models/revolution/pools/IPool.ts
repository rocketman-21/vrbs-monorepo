import { AlloPool as Pool } from "prisma-database";
import { Pool as AlloPoolData } from "@allo-team/allo-v2-sdk/dist/Allo/types";
import { Profile as AlloProfile } from "@allo-team/allo-v2-sdk/dist/Registry/types";

export interface IPool extends Pool, AlloPoolData {
  url: string;
  managers: `0x${string}`[];
  ownerProfile: AlloProfile;
  strategy: `0x${string}`;
}
