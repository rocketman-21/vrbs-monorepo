import "server-only";

import { cacheResult } from "@cobuild/libs/cache";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { database } from "../../..";
import { transformSubmission } from "./Submission";
import { getForScope } from "./get/getForScope";
import { createCreation } from "./set/createCreation";

export function Submissions() {
  return {
    getForScope,
    findBySlug,
    countByCreator,
    createCreation,
    countUniqueCreators,
    getByTokenURI,
  };
}

const countUniqueCreators = cache(
  async (cultureIndex: string, chainId: number): Promise<number | null> => {
    return cacheResult(`submission_uniqueCreators_${cultureIndex}_${chainId}`, 120, async () => {
      const creators = await database.submission.aggregateRaw({
        pipeline: [
          {
            $match: {
              chainId,
              contractAddress: cultureIndex.toLowerCase(),
            },
          },
          {
            $group: { _id: "$creators.address" },
          },
          { $project: { _id: 1 } },
        ],
      });

      // return count of unique creators
      return (creators?.length || 0) as number;
    });
  },
);

const findBySlug = cache(async (slug: string) => {
  const submission = await database.submission.findFirst({
    where: { slug: decodeURIComponent(slug) },
    orderBy: { createdAt: "desc" },
  });

  return submission ? transformSubmission(submission) : null;
});

const countByCreator = unstable_cache(
  async (address: string | null, cultureIndex: string | null) => {
    if (!address || !cultureIndex) return 0;

    return await database.submission.count({
      where: {
        creators: { some: { address } },
        contractAddress: cultureIndex,
      },
    });
  },
  undefined,
  { tags: ["submissions"], revalidate: 21600 },
);

const getByTokenURI = cache(async (tokenURI: string) => {
  const submission = await database.submission.findFirst({
    where: { tokenURI },
  });

  return submission ? transformSubmission(submission) : null;
});
