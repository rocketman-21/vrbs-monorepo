import { unstable_cache } from "next/cache";
import { CastWithInteractions, farcaster } from "./client";
import { getFarcasterUserByEthAddress } from "./getUser";
import { farcasterSpam } from "./spam";

export const getChannelCasts = unstable_cache(
  async (channelId: string) => {
    try {
      const feed = await farcaster.fetchFeed("filter", {
        channelId,
        filterType: "channel_id",
        limit: 100,
      });

      return feed.casts.filter(farcasterSpam);
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  undefined,
  { revalidate: 60 },
);

export const getCastByUrl = unstable_cache(
  async (url: string) => {
    try {
      return (await farcaster.lookUpCastByHashOrWarpcastUrl(url, "url")).cast;
    } catch (e) {
      console.error(e);
      return null;
    }
  },
  undefined,
  { revalidate: 600 },
);

export const getFeedForFid = unstable_cache(
  async (fid: number, limit = 25) => {
    const feed = await farcaster.fetchFeed("filter", {
      filterType: "fids",
      limit,
      fids: [fid],
      withRecasts: false,
    });

    return feed.casts;
  },
  undefined,
  { revalidate: 60 },
);

const getChannelFeedForFid = async (fid: number, channelId: string) => {
  let i = 0;
  let cursor: undefined | string = undefined;
  let allCasts: CastWithInteractions[] = [];

  while (i < 3) {
    const feed = await farcaster.fetchFeed("filter", {
      filterType: "fids",
      limit: 100,
      fids: [fid],
      withRecasts: false,
      cursor: cursor || undefined,
    });

    allCasts = allCasts.concat(feed.casts);
    cursor = feed.next.cursor || undefined;
    if (cursor === undefined) break;

    i++;
  }

  return allCasts.filter(c => c.channel?.id === channelId);
};

export const getChannelFeedForAddress = unstable_cache(
  async (address: `0x${string}`, channelId: string) => {
    const user = await getFarcasterUserByEthAddress(address);

    let casts: CastWithInteractions[] = [];

    if (!user) return { connected: false, casts };

    casts = await getChannelFeedForFid(user.fid, channelId);

    return { connected: true, casts };
  },
  undefined,
  { revalidate: 120 },
);
