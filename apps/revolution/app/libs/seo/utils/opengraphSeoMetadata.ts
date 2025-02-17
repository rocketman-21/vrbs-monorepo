import { Metadata } from "next";

export const generateOpenGraphSeoContent = (
  thumbnailUrl: string | null,
  width: number | null,
  height: number | null,
  videoUrl?: string | null,
): Metadata["openGraph"] => {
  return {
    videos: videoUrl
      ? [
          {
            url: videoUrl,
            width: width || 1024,
            height: height || 1024,
            type: "video/mp4",
            secureUrl: videoUrl,
          },
        ]
      : undefined,
    images: thumbnailUrl
      ? [
          {
            url: thumbnailUrl,
            width: width || 1024,
            height: height || 1024,
          },
        ]
      : undefined,
  };
};
