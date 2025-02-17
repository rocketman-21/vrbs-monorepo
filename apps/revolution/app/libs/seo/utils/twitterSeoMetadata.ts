import { Metadata } from "next";

export const generateTwitterSeoContent = (
  title: string,
  description: string,
  streamUrl?: string | null,
  videoUrl?: string | null,
  thumbnailUrl?: string | null,
  width?: number | null,
  height?: number | null,
): Metadata["twitter"] => {
  const card = streamUrl ? "player" : "summary_large_image";

  const mediaContent = streamUrl
    ? {
        players: {
          playerUrl: videoUrl,
          streamUrl: streamUrl,
          width: width || 500,
          height: height || 500,
        },
      }
    : {
        images: thumbnailUrl
          ? {
              url: thumbnailUrl,
            }
          : undefined,
      };

  return { title, description, card, ...mediaContent };
};
