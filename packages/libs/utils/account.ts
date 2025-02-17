import { truncateString } from "./text";

export function shortenUsername(username: string, limit = 15): string {
  return isEthAddress(username) ? getShortEthAddress(username) : truncateString(username, limit);
}

/**
 * Helper that returns a shortened username only if ethAddress
 *
 * @param {string} username
 * @returns {string}
 */
export const shortenIfEthAddress = (username: string = ""): string =>
  isEthAddress(username) ? getShortEthAddress(username) : username;

export const normalizeEthAddress = (address?: string): `0x${string}` | null => {
  if (!address) return null;
  if (isEthAddress(address)) return address.toLowerCase() as `0x${string}`;
  if (isEthAddress(`0x${address}`)) return `0x${address}`.toLowerCase() as `0x${string}`;
  return null;
};

export function getEthAddress(str?: string | null): `0x${string}` {
  if (!str) throw new Error("Invalid Eth Address");
  const address = normalizeEthAddress(str);
  if (!address) throw new Error("Invalid Eth Address");
  return address;
}

export const getMediumEthAddress = (address?: string | null): string =>
  address && address?.length > 10
    ? `${address?.substring(0, 10)}...${address?.substring(address.length - 10)}`
    : "";

/**
 * Eth address shortening helper method
 * @param {string} address
 * @returns {string} shortened eth address
 */
export const getShortEthAddress = (address?: string | null): string =>
  address && address?.length > 10
    ? `${address?.substring(0, 5)}...${address?.substring(address.length - 3)}`
    : "";

/**
 * Validates string is eth address
 * @param {string} text
 * @returns {boolean}
 */
export const isEthAddress = (text?: string | null): boolean =>
  /^(0x){1}[0-9a-fA-F]{40}$/i.test(text || "");

//0x348a...a79c
/**
 * Validates string is shortened eth address
 * @param {string} text
 * @returns {boolean}
 */
export const isShortenedEthAddress = (text?: string): boolean =>
  /^(0x)[0-9a-fA-F]{3,4}\.{3}[0-9a-fA-F]{3,4}$/i.test(text || "");
