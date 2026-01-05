"use server";

import { waitUntil } from "@vercel/functions";
import { kv } from "@vercel/kv";
import { revalidateTag, unstable_cache } from "next/cache";
import { logTime } from "./log-time";

const VERSION = "v2.11";

export async function cacheResult<T>(
  rawKey: string,
  ttl: number,
  fn: () => Promise<T>,
): Promise<T> {
  const key = getKey(rawKey);
  const revalidateSeconds = normalizeRevalidateSeconds(ttl);

  let didRun = false;

  try {
    const cachedFn = unstable_cache(
      async () => {
        didRun = true;
        const startTime = Date.now();
        const value = await fn();
        logTime(`Cached ${rawKey}`, startTime);
        return value;
      },
      [key],
      { revalidate: revalidateSeconds, tags: [key] },
    );

    return await cachedFn();
  } catch (error) {
    if (!shouldFallbackToKv(error, didRun)) {
      throw error;
    }

    return cacheResultWithKv(key, rawKey, ttl, fn);
  }
}

export async function deleteCacheResult(rawKey: string): Promise<void> {
  const key = getKey(rawKey);
  let didRevalidate = false;

  try {
    revalidateTag(key);
    didRevalidate = true;
  } catch {
    // Next cache not available in this context; KV fallback below.
  }

  try {
    await kv.del(key);
  } catch (error) {
    if (!didRevalidate) {
      throw error;
    }
  }

  console.debug("Deleted cache result for key:", key);
}

function normalizeRevalidateSeconds(ttl: number): number {
  if (!Number.isFinite(ttl) || ttl <= 0) return 1;
  return Math.floor(ttl);
}

function shouldFallbackToKv(error: unknown, didRun: boolean): boolean {
  if (!didRun) return true;
  if (!(error instanceof Error)) return false;
  return error.message.includes("unstable_cache");
}

async function cacheResultWithKv<T>(
  key: string,
  rawKey: string,
  ttl: number,
  fn: () => Promise<T>,
): Promise<T> {
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

function getKey(key: string): string {
  return `${VERSION}:${key.toLowerCase()}`;
}
