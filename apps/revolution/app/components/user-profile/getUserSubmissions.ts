"use server";

import { database } from "@cobuild/database";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { cacheResult } from "@cobuild/libs/cache";

export async function getUserSubmissions(address: `0x${string}`, revolutionId: string) {
  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution || !revolution.addresses) return { submissions: [], count: 0 };
  const { addresses } = revolution;

  return await cacheResult(`submissions-public-${address}-${revolutionId}`, 21600, async () => {
    const where = {
      creators: { some: { address } },
      contractAddress: addresses.cultureIndex,
      onchainSlug: { isSet: false },
      isHidden: { not: true },
    };

    const [submissions, count] = await Promise.all([
      database.submission.findMany({
        where,
        select: { name: true, thumbnailUrl: true, slug: true },
        orderBy: [{ createdAt: "desc" }],
        take: 4,
      }),
      database.submission.count({ where }),
    ]);

    return { submissions, count };
  });
}
