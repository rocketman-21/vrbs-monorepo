import "server-only";

import { database } from "@cobuild/database";
import { unstable_cache } from "next/cache";
import { CreationMediaGrid } from "./CreationMediaGrid";

interface Props {
  cultureIndex: `0x${string}`;
  placeholder?: string;
  revolutionId: string;
}

export const AuctionPreLaunchMedia = async (props: Props) => {
  const { cultureIndex, placeholder, revolutionId } = props;

  const submissions = await unstable_cache(
    async () =>
      await database.submission.findMany({
        where: { thumbnailUrl: { not: null }, contractAddress: cultureIndex },
        orderBy: { createdAt: "desc" },
        select: { thumbnailUrl: true, slug: true },
        take: 100,
      }),
    [cultureIndex],
    { revalidate: 30, tags: [`prelaunch-media`] },
  )();

  const artPieces = submissions
    .map(s => ({
      image: `${s.thumbnailUrl}`,
      url: `/${revolutionId}/creations/${s.slug}`,
      key: s.slug,
    }))
    .filter(Boolean);

  const minImageRowCount = Math.ceil(Math.sqrt(artPieces.length + 1));
  const minImageCount = Math.pow(minImageRowCount, 2);

  //populate images with placeholder images if there are not enough
  if (artPieces.length < minImageCount && placeholder) {
    for (let i = artPieces.length; i < minImageCount; i++) {
      artPieces.push({ image: placeholder, url: `/${revolutionId}`, key: `placeholder-${i}` });
    }
  }

  //shuffle the images
  for (let i = artPieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = artPieces[i];
    artPieces[i] = artPieces[j];
    artPieces[j] = temp;
  }

  return (
    <CreationMediaGrid
      minImageRowCount={minImageRowCount}
      artPieces={artPieces}
      placeholder={placeholder}
    />
  );
};
