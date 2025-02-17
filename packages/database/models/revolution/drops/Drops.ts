import { unstable_cache } from "next/cache";
import { database } from "../../../";
import { transformDrop } from "./Drop";

export function Drops() {
  return {
    getForRevolution,
    countForRevolution,
  };
}

const getForRevolution = unstable_cache(
  async (revolutionId: string, page = 1, take = 20) => {
    const drops = await database.drop.findMany({
      where: {
        revolutionId,
        metadata: { isSet: true },
        saleConfig: { isSet: true },
        hidden: false,
      },
      orderBy: { createdAt: "desc" },
      take,
      skip: take * (page - 1),
    });

    return drops.map(transformDrop);
  },
  undefined,
  { revalidate: 300, tags: ["drops"] },
);

const countForRevolution = unstable_cache(
  async (revolutionId: string) => {
    return await database.drop.count({
      where: {
        revolutionId,
        metadata: { isSet: true },
        saleConfig: { isSet: true },
        hidden: false,
      },
    });
  },
  undefined,
  { revalidate: 300, tags: ["drops"] },
);
