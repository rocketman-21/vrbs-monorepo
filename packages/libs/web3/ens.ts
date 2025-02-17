import { normalize } from "viem/ens";
import { isEthAddress, normalizeEthAddress } from "../utils/account";
import { getClient } from "./viem/clients";

export async function resolveEnsName(name: string): Promise<string | null> {
  try {
    return (await getClient(1).getEnsAddress({ name: normalize(name) }))?.toLowerCase() || null;
  } catch (e: any) {
    console.error(e);
    return null;
  }
}

export async function getEnsName(address: `0x${string}`): Promise<string | null> {
  if (!isEthAddress(address)) return null;

  try {
    return await getClient(1).getEnsName({ address: address as `0x${string}` });
  } catch (e: any) {
    console.error(e);
    return null;
  }
}

export async function getEnsAvatar(name: string): Promise<string | null> {
  try {
    return getClient(1).getEnsAvatar({ name });
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function normalizeEthAddressOrEnsName(raw: string): Promise<`0x${string}`> {
  const input = raw.trim().toLowerCase();
  const address = isEthAddress(input) ? normalizeEthAddress(input) : await resolveEnsName(input);
  if (!address || !isEthAddress(address)) {
    throw new Error("Invalid ETH adress or ENS name");
  }
  return address as `0x${string}`;
}
