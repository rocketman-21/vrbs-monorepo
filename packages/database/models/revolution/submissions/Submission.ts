import "server-only";

import { getEthAddress } from "@cobuild/libs/utils/account";
import { Submission } from "prisma-database";
import { database } from "../../..";
import { Profiles } from "../../social/Profiles";
import { ISubmission } from "./ISubmission";

export function transformSubmission(submission: Submission): ISubmission {
  const width = submission.mediaMetadata?.width || 1024;
  const height = submission.mediaMetadata?.height || 1024;

  return Object.assign(submission, {
    sponsorAddress: getEthAddress(submission.sponsorAddress),
    contractAddress: submission.contractAddress ? getEthAddress(submission.contractAddress) : null,
    videoUrl: getVideoUrl(submission),
    streamUrl: submission.muxStreamUrl,
    thumbnailUrl: getThumbnailUrl(submission),
    mediaType: submission.mediaMetadata?.type || "video",

    layout: {
      isVertical: width < height,
      isSquare: width === height,
      isHorizontal: width > height,
    },
    width,
    height,

    async votes() {
      return await getVotes(submission.slug);
    },
    async creatorProfiles() {
      return await getCreatorProfiles(submission);
    },
  });
}

export const getCreatorProfiles = async (submission: Submission) => {
  return Profiles().getMany(submission.creators.map(creator => creator.address as `0x${string}`));
};

function getVideoUrl(submission: Submission) {
  if (submission.mediaMetadata?.type !== "video") return null;

  if (submission.muxStreamUrl) {
    return submission.muxStreamUrl.replace(".m3u8", "/medium.mp4");
  }

  return submission.url;
}

function getThumbnailUrl(submission: Submission) {
  const { url, mediaMetadata } = submission;

  const thumbnailUrl = submission.thumbnailUrl?.replace(
    "thatsgnarly.mypinata.cloud",
    "revolution.mypinata.cloud",
  );

  if (!thumbnailUrl && mediaMetadata?.type === "image") {
    return url;
  }

  if (thumbnailUrl?.endsWith(".ipfs.nftstorage.link")) {
    const fileHash = thumbnailUrl.split("https://")[1].split(".ipfs.nftstorage.link")[0];
    return `https://nftstorage.link/ipfs/${fileHash}`;
  }
  return thumbnailUrl;
}

async function getVotes(slug: string) {
  const votes = await database.upvote.findMany({
    where: {
      slug,
      stale: false,
    },
    select: { voter: true, weight: true },
  });

  return votes.map(({ voter, weight }) => ({
    weight,
    voter: getEthAddress(voter),
  }));
}
