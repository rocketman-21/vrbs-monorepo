import "server-only";

import Fuse from "fuse.js";
import { Proposal } from "prisma-database";
import { cache } from "react";
import { database } from "../..";
import { Revolutions } from "../revolution/revolutions/Revolutions";
import { IProposal } from "./IProposal";
import { transformProposal } from "./Proposal";
import { parseEther } from "viem";
import { unstable_cache } from "next/cache";

export function Proposals() {
  return Object.assign(database.proposal, {
    findById,
    getLatestId,
    search,
    getByUniqueId,
    countForEntityId,
    getTotalFundedAmountEth,
  });
}

const findById = cache(async (proposalId: string, entityId: string): Promise<IProposal | null> => {
  const proposal = await database.proposal.findFirst({
    where: { proposalId, entityId },
    include: { profile: { select: { profilePicture: true, username: true } } },
    // cacheStrategy: { ttl: 600 },
  });
  return proposal ? transformProposal(proposal) : null;
});

// Either get child or parent's children
const countForEntityId = unstable_cache(
  async (entityId: string) => {
    return await database.proposal.count({ where: { entityId } });
  },
  undefined,
  { revalidate: 1200, tags: ["proposals-count"] },
);

const getTotalFundedAmountEth = async (entityId: string): Promise<number> => {
  const proposals = await database.proposal.findMany({
    where: { entityId, status: "executed" },
    select: { payoutAmount: true },
  });

  return proposals.reduce((acc, proposal) => {
    const eth = parseEther(proposal.payoutAmount?.quantity || "0", "wei");

    return acc + Number(eth / BigInt(1e18));
  }, 0);
};

const getByUniqueId = cache(async (uniqueId: string): Promise<IProposal | null> => {
  const proposal = await database.proposal.findFirst({
    where: { uniqueId },
    include: { profile: { select: { profilePicture: true, username: true } } },
    // cacheStrategy: { ttl: 600 },
  });
  return proposal ? transformProposal(proposal) : null;
});

const getLatestId = cache(async (revolutionId: string): Promise<string | null> => {
  const entityId = (await Revolutions().getById(revolutionId))?.governanceEntityId;
  if (!entityId) return null;

  const proposal = await database.proposal.findFirst({
    where: { entityId },
    select: { proposalId: true },
    orderBy: { creation: { block: "desc" } },
    // cacheStrategy: { ttl: 60 },
  });
  return proposal?.proposalId || null;
});

const search = async (options: {
  entityId: string;
  phrase?: string;
  status?: IProposal["status"];
  sort?: string;
  take?: number;
}) => {
  const { entityId, phrase, status, sort = "Newest", take } = options;

  const proposals = (
    await Proposals().findMany({
      where: {
        entityId,
        ...(status ? { status } : {}),
      },
      orderBy: getProposalOrderBy(sort),
      // cacheStrategy: { ttl: 60 },
      select: {
        profile: { select: { username: true, profilePicture: true } },
        proposalId: true,
        proposer: true,
        description: true,
        status: true,
        title: true,
        type: true,
        options: true,
        values: true,
        targets: true,
        calldatas: true,
        signatures: true,
        totalVotes: true,
        totalUniqueVotes: true,
        strategy: true,
      },
      take,
    })
  ).map(proposal => transformProposal(proposal as any as Proposal));

  if (!phrase || phrase.length < 1) return proposals;

  const fuse = new Fuse(proposals, {
    threshold: 0.2,
    keys: [{ name: "title", weight: 3 }, { name: "profile.username", weight: 1.8 }, "description"],
    distance: 10000,
    shouldSort: sort !== "Newest",
  });

  return fuse.search(phrase).map(result => result.item);
};

function getProposalOrderBy(label = "Newest") {
  switch (label) {
    case "Oldest":
      return { creation: { block: "asc" } } as const;
    case "Most favored":
      return { totalVotes: "desc" } as const;
    case "Highest Budget":
      return { payoutAmount: { eth: "desc" } } as const;
    case "Newest":
    default:
      return { creation: { block: "desc" } } as const;
  }
}
