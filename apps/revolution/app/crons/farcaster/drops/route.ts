import "server-only";

import { database } from "@cobuild/database";
import { transformCast } from "@cobuild/database/models/social/Cast";
import { CastWithInteractions } from "@cobuild/libs/farcaster/client";
import { getEthAddress } from "@cobuild/libs/utils/account";
import { sleep } from "@cobuild/libs/utils/dom";
import { getChainByName } from "@cobuild/libs/web3/utils";
import { EmbedUrl } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { kv } from "@vercel/kv";
import { base } from "viem/chains";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { ingestDrop } from "./ingest-drop";
import { updateDrop } from "./update-drop";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 300;

const KEY = "farcaster-drops-cron-last-run";

export async function GET() {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    const lastRun = isProduction ? (await kv.get<string>(KEY)) || "0" : "0";

    const existingDrops = await database.drop.findMany({
      where: { chainId: base.id },
      select: { url: true },
      orderBy: { updatedAt: "desc" },
      take: 1000,
    });

    const dropsWithMissingData = await database.drop.findMany({
      where: { chainId: base.id, saleConfig: { isSet: false } },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    const dropsNeedingUpdate = await database.drop.findMany({
      where: { chainId: base.id, saleConfig: { isSet: true } },
      orderBy: { updatedAt: "asc" },
      take: 50,
    });

    const casts = (
      await database.cast.findMany({
        where: { updatedAt: { gte: new Date(lastRun) } },
        take: isProduction ? undefined : 250,
        orderBy: { updatedAt: "desc" },
      })
    )
      .map(transformCast)
      .map(cast => ({ ...cast, zora: extractZoraData(cast) }))
      .filter(cast => !!cast.zora)
      .filter(({ zora }) => !existingDrops.some(d => d.url === zora?.url));

    for (const cast of casts) {
      // TODO: Remove this once we have a drop for every chain
      if (!cast.zora || cast.zora.chainId !== base.id) continue;
      await ingestDrop({ ...cast.zora, revolutionId: cast.revolutionId });
      await sleep(50);
    }

    for (const drop of dropsWithMissingData) {
      console.log({ updatingDrop: drop });
      await updateDrop(drop);
      await sleep(50);
    }

    for (const drop of dropsNeedingUpdate) {
      console.log({ updatingDrop: drop });
      await updateDrop(drop);
      await sleep(50);
    }

    if (isProduction) await kv.set(KEY, Date.now());

    revalidateTag("drops");

    return NextResponse.json({ created: casts.length, updated: dropsWithMissingData.length });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Error" }, { status: 500 });
  }
}

function extractZoraData(cast: CastWithInteractions) {
  const zoraUrl = (
    cast.embeds
      .filter(e => e.hasOwnProperty("url"))
      .find(e => (e as EmbedUrl).url.includes("zora.co/collect")) as EmbedUrl | undefined
  )?.url.split("?")[0];

  if (!zoraUrl) return null;

  const dataFromLink = parseZoraCollectUrl(zoraUrl);
  if (!dataFromLink) return null;

  return { url: zoraUrl, ...dataFromLink };
}

function parseZoraCollectUrl(url: string): {
  chainId: number;
  contract: `0x${string}`;
  tokenId: string;
} | null {
  try {
    // Sample URL:
    // https://zora.co/collect/zora:0xd8fce2db92ecd0eab48421f016621e29142c7cf2/18
    const { pathname } = new URL(url);

    if (!pathname.startsWith("/collect/")) throw new Error(`Couldn't parse Zora URL for ${url}`);

    const [contractData, tokenId] = pathname.replace("/collect/", "").split("/");
    if (!tokenId) throw new Error(`Couldn't find tokenId in ${url}`);
    const [chainName, contract] = contractData.split(":");

    return {
      chainId: getChainByName(chainName).id,
      contract: getEthAddress(contract),
      tokenId,
    };
  } catch (e: any) {
    console.error(e?.message);
    return null;
  }
}
