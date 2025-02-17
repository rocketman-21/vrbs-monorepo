import { database } from "@cobuild/database";
import { EntityTrackers } from "@cobuild/database/models/eth/EntityTrackers";
import { GovernanceType } from "@cobuild/database/types";
import { deleteCacheResult } from "@cobuild/libs/cache";
import { Auction, OnchainEvent } from "prisma-database";
import { generateNounishAuction } from "./generateAuction";

export interface IAuctionCreatedEvent {
  tokenId: bigint;
  startTime: bigint;
  endTime: bigint;
}

export const getOrCreateAuction = async (
  args: IAuctionCreatedEvent,
  entityId: string,
  event: OnchainEvent,
  tokenContract: string,
  type: GovernanceType,
): Promise<Auction> => {
  const entity = await EntityTrackers().getEntityTracker(entityId);
  const auctionContractAddress = event.address.toLowerCase();
  if (!entity) throw new Error(`Entity not found for ${entityId}`);

  const doc = await generateNounishAuction(
    args,
    entity,
    event,
    tokenContract,
    auctionContractAddress,
    type,
  );
  const { uniqueId } = doc;
  const auction = await database.auction.upsert({
    where: { uniqueId },
    create: doc,
    update: doc,
  });

  await deleteCacheResult(uniqueId);

  return auction;
};
