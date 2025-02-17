import "server-only";

import { calculateUserSalary } from "@cobuild/libs/revolution/salary";
import { shortenIfEthAddress } from "@cobuild/libs/utils/account";
import { Profile } from "../../types";
import { Grants } from "../revolution/grants/Grants";
import { IProfile } from "./IProfile";

export function transformProfile(profile: Omit<Profile, "id" | "updatedAt">): IProfile {
  return Object.assign(profile, {
    address: `${profile.address.toLowerCase()}` as `0x${string}`,
    displayUsername: shortenIfEthAddress(profile.username),
  });
}

export async function getUserSalary(revolutionId: string, user: `0x${string}`) {
  const grants = await Grants().getForUser(revolutionId, user);

  return calculateUserSalary(grants);
}
