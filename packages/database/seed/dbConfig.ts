import { subDays, subMinutes } from "date-fns";
import uniq from "lodash/uniq";
import { EntityTracker } from "prisma-database";
import { Database, SeedService } from "./service";

type CollectionConfig = { db: Database; name: string; filter?: object };

const daysAgo = (days: number) => ({ $gt: subDays(new Date(), days) });
const minutesAgo = (minutes: number) => ({ $gt: subMinutes(new Date(), minutes) });

export const collectionConfig: CollectionConfig[] = [
  // Revolution

  { db: Database.Revolution, name: "auctions" },
  { db: Database.Revolution, name: "pointsPurchases" },
  { db: Database.Revolution, name: "auctionBids", filter: { createdAt: daysAgo(60) } },
  { db: Database.Revolution, name: "alloProfiles" },
  { db: Database.Revolution, name: "splits" },
  { db: Database.Revolution, name: "contests" },
  { db: Database.Revolution, name: "alloPools" },
  { db: Database.Revolution, name: "profiles" },
  { db: Database.Revolution, name: "casts" },
  { db: Database.Revolution, name: "drops" },
  { db: Database.Revolution, name: "revolutions" },
  { db: Database.Revolution, name: "stories" },
  { db: Database.Revolution, name: "submissions" },
  { db: Database.Revolution, name: "upvotes", filter: { strategy: "culture-index-v1" } },
  { db: Database.Revolution, name: "revenueMetrics" },

  // Social
  { db: Database.Revolution, name: "posts", filter: { createdAt: daysAgo(365) } },
  { db: Database.Revolution, name: "drafts" },
  { db: Database.Revolution, name: "ideas" },

  // Eth
  {
    db: Database.Revolution,
    name: "blocks",
    filter: { timestamp: minutesAgo(300), chainId: { $in: [1, 11155111, 137, 8453, 84532] } },
  },

  {
    db: Database.Revolution,
    name: "events",
    filter: async (seed: SeedService) => {
      const contracts: Partial<EntityTracker>[] = (await seed
        .getRemoteCollection(Database.Revolution, "entityTrackers")
        ?.find(
          {
            trackerType: {
              $in: [
                // "nouns_auction",
                // "gnars_auction",
                "revolution_auction",
                "revolution_dao_v1",
                "revolution_split",
                "culture_index",
                // "nouns_dao_v1",
                // "nouns_dao_v2",
                // "nouns_dao_v3",
              ],
            },
          },
          { projection: { contracts: 1, chainId: 1 } },
        )
        .toArray()) as any[];

      const chainIds = [];

      let addresses = [];

      //if we have entity tracker contracts, add them
      if (contracts.length) {
        for (let entity of contracts) {
          if (entity.contracts) {
            for (let contract of entity.contracts) {
              addresses.push(contract.address.toLowerCase());
              chainIds.push(entity.chainId);
            }
          }
        }
      }

      return {
        chainId: { $in: uniq(chainIds) },
        address: { $in: uniq(addresses) },
        createdAt: daysAgo(61),
      };
    },
  },

  { db: Database.Revolution, name: "eventTrackers" },
  { db: Database.Revolution, name: "entityTrackers" },
  { db: Database.Revolution, name: "proposals" },
  { db: Database.Revolution, name: "entities" },
  { db: Database.Revolution, name: "votes", filter: { "votedAt.time": daysAgo(200) } },
  { db: Database.Revolution, name: "cultureIndexes" },
  // { db: Database.Revolution, name: "contests" },
];
