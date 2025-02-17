import { ICreationsFilter } from "@cobuild/libs/revolution/interfaces";
import { Prisma } from "prisma-database";
import { cache } from "react";
import { database } from "../../../..";
import { transformSubmission } from "../Submission";

export const getForScope = cache(
  async (args: {
    contractAddress: `0x${string}`;
    filter: ICreationsFilter;
    perPage?: number;
    page?: number;
    creatorAddress?: string;
  }) => {
    const { contractAddress, filter, perPage = 1, page = 0, creatorAddress } = args;

    const where = getWhereInput({ contractAddress, filter, creatorAddress });

    const [submissions, count] = await Promise.all([
      database.submission.findMany({
        where,
        orderBy: getOrderBy(filter),
        take: perPage,
        skip: page * perPage,
      }),
      database.submission.count({ where }),
    ]);

    return {
      submissions: submissions.map(transformSubmission),
      count,
    };
  },
);

const getWhereInput = (args: {
  contractAddress: `0x${string}`;
  filter: ICreationsFilter;
  creatorAddress?: string;
}) => {
  const { contractAddress, filter, creatorAddress } = args;

  const where: Prisma.SubmissionWhereInput = {
    OR: [{ onchainSlug: { isSet: false } }, { onchainSlug: null }],
    contractAddress,
  };

  if (filter === "next-up") {
    where["hasBeenDropped"] = false;
  }

  if (filter === "auctioned") {
    where["hasBeenDropped"] = true;
  }

  if (filter === "hidden") {
    where["isHidden"] = true;
  } else if (filter !== "next-up" && filter !== "mine") {
    // we still want to see if something is going to be dropped but was flagged
    where["isHidden"] = { not: true };
  }

  if (!!creatorAddress) {
    where["creators"] = { some: { address: creatorAddress } };
  }

  return where;
};

const getOrderBy = (
  filter: ICreationsFilter,
): Prisma.SubmissionOrderByWithRelationInput | Prisma.SubmissionOrderByWithRelationInput[] => {
  switch (filter) {
    case "next-up":
    case "auctioned":
    case "user":
      return [{ votesWeight: "desc" }, { createdAt: "asc" }];
    default:
      return [{ createdAt: "desc" }];
  }
};
