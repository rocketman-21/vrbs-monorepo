import "server-only";

import Mux from "@mux/mux-node";
import { Asset } from "@mux/mux-node/resources/video/assets";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID as string,
  tokenSecret: process.env.MUX_TOKEN_SECRET as string,
});

export async function getUploadedVideo(muxUploadId: string) {
  const upload = await mux.video.uploads.retrieve(muxUploadId);
  if (!upload || !upload.asset_id) return null;

  const asset = await mux.video.assets.retrieve(upload.asset_id);

  const muxStreamUrl = getStreamUrl(asset);
  if (!muxStreamUrl) return null;

  const dimensions = getVideoDimensions(asset);

  return {
    muxStreamData: asset as any,
    muxStreamUrl,
    thumbnailUrl: getThumbnailUrl(asset),
    width: dimensions?.width || null,
    height: dimensions?.height || null,
  };
}

export function getStreamUrl(asset: Asset) {
  const id = getIdFromAsset(asset);
  return `https://stream.mux.com/${id}.m3u8`;
}

export function getThumbnailUrl(asset: Asset) {
  const id = getIdFromAsset(asset);
  return `https://image.mux.com/${id}/thumbnail.webp`;
}

export function getVideoDimensions(asset: Asset): { width: number; height: number } | null {
  if (!asset?.tracks) return null;

  for (const track of asset.tracks) {
    if (track.type === "video" && track.max_width && track.max_height) {
      const sum = track.max_width + track.max_height;
      const coefficient = sum < 1200 ? 1.5 : 1;

      return {
        width: track.max_width * coefficient,
        height: track.max_height * coefficient,
      };
    }
  }

  return null;
}

const getIdFromAsset = (asset: Asset) => {
  const { playback_ids } = asset;

  if (!playback_ids || playback_ids.length === 0)
    throw new Error("No playback ids found for asset");

  const { id } = playback_ids[0];
  return id;
};
