import "server-only";

import { database } from "@cobuild/database";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { CastWithInteractions, farcaster } from "@cobuild/libs/farcaster/client";
import { farcasterSpam } from "@cobuild/libs/farcaster/spam";
import { logTime } from "@cobuild/libs/log-time";
import { sleep } from "@cobuild/libs/utils/dom";
import omit from "lodash/omit";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 300;

const revolutions = ["vrbs"] as const;

export async function GET() {
  try {
    for (const revolutionId of revolutions) {
      await ingestFarcasterChannelForRevolution(revolutionId);
      sleep(250);
    }

    return NextResponse.json({ revolutions });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Error" }, { status: 500 });
  }
}

async function ingestFarcasterChannelForRevolution(revolutionId: string) {
  const revolution = await Revolutions().getById(revolutionId);

  if (!revolution) {
    throw new Error(`Invalid revolution ${revolutionId}`);
  }

  if (!revolution.farcasterChannelId) {
    throw new Error(`Missing Farcaster channelId for ${revolutionId}`);
  }

  const channelId = revolution.farcasterChannelId;
  const currentTime = Date.now();

  const feed = await farcaster.fetchFeed("filter", {
    channelId,
    filterType: "channel_id",
    limit: 100,
    // filterType: "embed_url", // Uncomment this + below for test data
    // embedUrl: "zora.co",
  });

  console.log(feed);

  const bulkWriteOps = feed.casts
    .filter(farcasterSpam)
    .filter(c => !!c.channel)
    .map(({ hash, ...cast }) => {
      const data = {
        ...omit(cast, "object"), // "object" property exists, but it's not in TS type. We need to exlude it to not break Prisma query
        type: cast.type,
        author: omit(cast.author, "object") as object,
        parent_author: cast.parent_author as object,
        embeds: cast.embeds as object[],
        reactions: cast.reactions as object,
        replies: cast.replies as object,
        frames: cast.frames as object[],
        mentioned_profiles: cast.mentioned_profiles as object[],
        channel: omit(cast.channel, "object") as object,
        revolutionId,
        timestamp: { $date: cast.timestamp } as any,
        createdAt: { $date: cast.timestamp } as any,
        updatedAt: { $date: new Date() } as any,
        hash,
      };

      return {
        q: { hash },
        u: { $set: data },
        upsert: true,
      };
    });

  const result = await database.$runCommandRaw({
    update: "casts",
    updates: bulkWriteOps as any,
  });

  logTime(
    `Farcaster "${channelId}" channel sync. Modified ${result.nModified} out of ${result.n}`,
    currentTime,
  );
}
