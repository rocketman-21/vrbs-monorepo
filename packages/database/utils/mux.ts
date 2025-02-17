export interface VideoTrack {
  id: string;
  passthrough: string;
  type: "video";
  duration: number;
  max_width: number;
  max_height: number;
  max_frame_rate: number;
}
export interface Asset {
  tracks?: Array<VideoTrack>;
}
export function getVideoDimensions(asset: Asset): { width: number; height: number } | null {
  if (!asset?.tracks) return null;

  for (const track of asset.tracks) {
    if (track.type === "video") {
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
