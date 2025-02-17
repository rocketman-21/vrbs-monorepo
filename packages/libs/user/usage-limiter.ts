import { kv } from "@vercel/kv";

const LIMIT_PERIOD = 6 * 3600; // 6h

const LIMITS_PER_USER = {
  openai: 20, //  Max requests per user per LIMIT_PERIOD
} as const;

type Action = keyof typeof LIMITS_PER_USER;

export async function isUserThrottled(address: `0x${string}`, action: Action) {
  const count = await getUserUsage(address, action);
  return count >= LIMITS_PER_USER[action];
}

export async function recordUserUsage(address: `0x${string}`, action: Action) {
  const count = await getUserUsage(address, action);
  await kv.set(cacheKey(address, action), 1 + count, { ex: LIMIT_PERIOD });
}

async function getUserUsage(address: `0x${string}`, action: Action) {
  return (await kv.get<number>(cacheKey(address, action))) || 0;
}

const cacheKey = (address: `0x${string}`, action: Action) => `${address}_${action}`;
