"use server";

import { waitUntil } from "@vercel/functions";
import { kv } from "@vercel/kv";
import { logTime } from "./log-time";

const VERSION = "v2.11";

export async function cacheResult<T>(
  rawKey: string,
  ttl: number,
  fn: () => Promise<T>,
): Promise<T> {
  const key = getKey(rawKey);
  const cachedValue = await kv.get<{ value: T; expires: number }>(key);

  const ex = ttl >= 3600 ? Math.max(3600 * 24, ttl) : Math.max(30 * 60, ttl * 4);
  const currentTime = Date.now();
  const expires = currentTime + ttl * 1000;

  // No cached value - wait for fetch and cache
  if (typeof cachedValue === "undefined" || cachedValue === null) {
    const value = await fn();
    kv.set(key, { value, expires }, { ex });
    logTime(`Cached ${rawKey}`, currentTime);
    return value;
  }

  if (currentTime >= cachedValue.expires) {
    // console.debug(`Background revalidation of ${key}`);
    waitUntil(fn().then(value => kv.set(key, { value, expires }, { ex })));
  }

  return cachedValue.value;
}

export async function deleteCacheResult(rawKey: string): Promise<void> {
  const key = getKey(rawKey);
  await kv.del(key);
  console.debug("Deleted cache result for key:", key);
}

function getKey(key: string): string {
  return `${VERSION}:${key.toLowerCase()}`;
}
