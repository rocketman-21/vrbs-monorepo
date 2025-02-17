import "server-only";

import { cacheResult } from "@cobuild/libs/cache";
import { CastWithInteractions } from "@cobuild/libs/farcaster/client";
import { getCastByUrl, getChannelCasts } from "@cobuild/libs/farcaster/getCasts";
import { isAdmin } from "@cobuild/libs/revolution/admin";
import { EmbedUrl } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { Story } from "prisma-database";
import { database } from "../../..";
import { nonNullable } from "../../../utils";
import { Revolutions } from "../revolutions/Revolutions";
import { IStory } from "./IStory";

export function transformStory(story: Story): IStory {
  const url = `/${story.revolutionId}/stories/${story.slug}`;

  const thumbnailUrl = story.thumbnailUrl.replace(
    "thatsgnarly.mypinata.cloud",
    "revolution.mypinata.cloud",
  );

  return Object.assign(story, {
    team: story.team as `0x${string}`[],
    contributors: story.contributors as { address: `0x${string}`; comment: string }[],
    url,
    thumbnailUrl,
    imageUrl: story.imageUrl || thumbnailUrl,
    body: story.body.replaceAll("thatsgnarly.mypinata.cloud", "revolution.mypinata.cloud"),
    canBeEditedBy: (user: `0x${string}` | null) => {
      if (!user) return false;
      return story.team.includes(user) || isAdmin(user, story.revolutionId);
    },
    updates: async () =>
      cacheResult(`story_updates_${story.slug}`, 60, () => getUpdates({ url, ...story })),
  });
}

async function getUpdates(story: Story & { url: string }) {
  try {
    const { url, externalUrl, revolutionId, updatedAt } = story;

    const revolution = await Revolutions().getById(revolutionId);
    if (!revolution) throw new Error("Revolution not found");

    const channelId = revolution.farcasterChannelId;

    const channelCasts = channelId
      ? (await getChannelCasts(channelId)).filter(c => isStoryCast(c, url, externalUrl))
      : [];

    const attachedCasts = await Promise.all(story.casts.map(url => getCastByUrl(url)));

    const casts = [...channelCasts, ...attachedCasts]
      .filter(nonNullable)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const recentCastDate = casts.length > 0 ? new Date(casts[0].timestamp) : new Date(0);

    if (recentCastDate > new Date(updatedAt)) {
      await database.story.update({ where: { id: story.id }, data: { updatedAt: recentCastDate } });
    }

    return casts;
  } catch (e) {
    console.error(e);
    return [];
  }
}

function isStoryCast(cast: CastWithInteractions, rawUrl: string, rawExternalUrl: string | null) {
  function normalizeUrl(url: string) {
    return url.replace(/^https?:\/\//, "").replace(/\/$/, ""); // Remove http(s) & ending slash
  }

  const url = normalizeUrl(rawUrl);
  const externalUrl = rawExternalUrl ? normalizeUrl(rawExternalUrl) : null;

  if (cast.text.includes(url)) return true;
  if (externalUrl && cast.text.includes(externalUrl)) return true;

  return cast.embeds.some(
    embed =>
      (embed as EmbedUrl).url?.includes(url) ||
      (externalUrl && (embed as EmbedUrl).url?.includes(externalUrl)),
  );
}
