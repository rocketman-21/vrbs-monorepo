export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 300;

import "server-only";

import { database } from "@cobuild/database";
import { EntityTrackers } from "@cobuild/database/models/eth/EntityTrackers";
import { EventTrackers } from "@cobuild/database/models/eth/EventTrackers";
import { Contests } from "@cobuild/database/models/revolution/contests/Contests";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import {
  CONTEST_BUILDER_ADDRESSES,
  REVOLUTION_BUILDER_ADDRESSES,
} from "@cobuild/database/models/revolution/revolutions/addresses";
import { IRevolution } from "@cobuild/database/types";
import { getRevolutionBuilderImplementations } from "@cobuild/libs/web3/viem/utils/revolutionBuilder";
import { NextRequest, NextResponse } from "next/server";
import { getAbiForImplementation } from "onchain-ingestion/events/utils/AbiMapping";
import { TrackerType } from "prisma-database";
import { AbiItem } from "viem";
import { base } from "viem/chains";
import thatsgnarlyConfig from "@cobuild/libs/revolution/config/thatsgnarly";

export async function GET(req: NextRequest) {
  try {
    await ingestBuilderEntities();

    await ingestContestBuilderEntities();

    const revolutions = await Revolutions().getAllOnchainRevolutions();

    if (!revolutions) {
      return NextResponse.json({
        error: "missing revolutions",
      });
    }

    const alreadyIngested = await database.entityTracker.findMany({
      where: {
        trackerType: {
          in: [
            "culture_index",
            "revolution_auction",
            "revolution_dao_v1",
            "points_emitter",
            "revolution_split",
            "revolution_builder",
          ],
        },
      },
      select: { contract: true, chainId: true },
    });

    let contestCultureIndexContracts = await Contests().getAllCultureIndexes();

    // for thatsgnarly
    if (thatsgnarlyConfig.addresses?.cultureIndex) {
      contestCultureIndexContracts.push({
        address: thatsgnarlyConfig.addresses?.cultureIndex,
        chainId: base.id,
      });
    }

    for (const contract of contestCultureIndexContracts) {
      await ingestCultureIndexEntities(contract.address, contract.chainId);
    }

    const cultureIndexContracts = filterContracts(revolutions, alreadyIngested, "cultureIndex");
    const auctionHouseContracts = filterContracts(revolutions, alreadyIngested, "auction");
    const pointsEmitterContracts = filterContracts(revolutions, alreadyIngested, "pointsEmitter");
    const daoContracts = filterContracts(revolutions, alreadyIngested, "dao");
    const splitsContracts = filterContracts(revolutions, alreadyIngested, "splits");

    for (const contract of cultureIndexContracts) {
      const { addresses, chainId } = contract;
      if (!addresses || !addresses.cultureIndex) continue;

      await ingestCultureIndexEntities(addresses.cultureIndex, chainId);
    }

    for (const contract of pointsEmitterContracts) {
      const { addresses, chainId } = contract;
      if (!addresses) continue;

      const implementations = await getImplementations(chainId);

      if (!implementations.pointsEmitterImpl || !addresses.pointsEmitter) {
        throw new Error(
          `No implementation contract found for chainId ${chainId} for points emitter`,
        );
      }

      const startBlock = await createEntityTracker(
        addresses.pointsEmitter,
        "points_emitter",
        implementations.pointsEmitterImpl,
        chainId,
      );

      const ERC20_TRANSFER = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

      // track the transfer event for the specific points contract
      await EventTrackers().getOrCreateEventTrackerFromTopic(
        chainId,
        ERC20_TRANSFER,
        //assumes function is run right when the contract is deployed, so we start tracking from the current block
        startBlock,
        "Transfer",
        implementations.pointsImpl,
        addresses.points,
      );
    }

    // ingest splits
    for (const contract of splitsContracts) {
      const { addresses, chainId } = contract;
      if (!addresses) continue;

      const implementations = await getImplementations(chainId);

      if (!implementations.splitsCreatorImpl || !addresses.splitsCreator) {
        throw new Error(`No implementation contract found for chainId ${chainId} for splits`);
      }

      await createEntityTracker(
        addresses.splitsCreator,
        "revolution_split",
        implementations.splitsCreatorImpl,
        chainId,
      );
    }

    // ingest auction house
    for (const contract of auctionHouseContracts) {
      const { addresses, chainId } = contract;
      if (!addresses) continue;

      const implementations = await getImplementations(chainId);

      if (!implementations.auctionImpl || !addresses.auction) {
        throw new Error(`No implementation contract found for chainId ${chainId} for auction`);
      }

      await createEntityTracker(
        addresses.auction,
        "revolution_auction",
        implementations.auctionImpl,
        chainId,
      );
    }

    // ingest dao
    for (const contract of daoContracts) {
      const { addresses, chainId } = contract;
      if (!addresses) continue;

      const implementations = await getImplementations(chainId);

      if (!implementations.daoImpl || !addresses.dao) {
        throw new Error(`No implementation contract found for chainId ${chainId} for dao`);
      }

      await createEntityTracker(
        addresses.dao,
        "revolution_dao_v1",
        implementations.daoImpl,
        chainId,
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error({ error });
    return new Response(error.message, { status: 500 });
  }
}

async function createEntityTracker(
  contract: `0x${string}`,
  trackerType: TrackerType,
  implementationContract: `0x${string}`,
  chainId: number,
) {
  return await EntityTrackers().createEntityTracker(
    null,
    contract.toLowerCase() as `0x${string}`,
    trackerType,
    chainId,
    implementationContract.toLowerCase(),
    (await getAbiForImplementation(implementationContract, chainId)) as AbiItem[],
  );
}

function filterContracts(
  revolutions: IRevolution[],
  alreadyIngested: { chainId: number; contract: string }[],
  contractType: "dao" | "auction" | "cultureIndex" | "pointsEmitter" | "splits",
) {
  return revolutions.filter(rev => {
    const { addresses, chainId } = rev;
    if (!addresses) return false;

    return !alreadyIngested.find(entity => {
      const chainIdsMatch = entity.chainId === chainId;
      if (contractType === "dao") {
        return entity.contract === addresses.dao && chainIdsMatch;
      }
      if (contractType === "auction") {
        return entity.contract === addresses.auction && chainIdsMatch;
      }
      if (contractType === "cultureIndex") {
        return entity.contract === addresses.cultureIndex && chainIdsMatch;
      }
      if (contractType === "pointsEmitter") {
        return entity.contract === addresses.pointsEmitter && chainIdsMatch;
      }
      if (contractType === "splits") {
        return entity.contract === addresses.splitsCreator && chainIdsMatch;
      }
    });
  });
}

async function getImplementations(chainId: number) {
  const implementations = await getRevolutionBuilderImplementations(
    REVOLUTION_BUILDER_ADDRESSES[chainId],
    chainId,
  );

  return implementations;
}

async function ingestBuilderEntities() {
  // loop over REVOLUTION_BUILDER_ADDRESSES
  const chainIds = Object.keys(REVOLUTION_BUILDER_ADDRESSES).map(Number);

  for (const chainId of chainIds) {
    await EntityTrackers().createEntityTracker(
      null,
      REVOLUTION_BUILDER_ADDRESSES[chainId],
      "revolution_builder",
      chainId,
      REVOLUTION_BUILDER_ADDRESSES[chainId],
      (await getAbiForImplementation(REVOLUTION_BUILDER_ADDRESSES[chainId], chainId)) as AbiItem[],
    );
  }
}

async function ingestCultureIndexEntities(address: `0x${string}`, chainId: number) {
  const implementations = await getImplementations(chainId);

  if (!implementations.cultureIndexImpl) {
    throw new Error(`No implementation contract found for chainId ${chainId} for culture index`);
  }

  console.debug(`Creating CultureIndex EntityTracker (${chainId}) for ${address}`);

  await createEntityTracker(address, "culture_index", implementations.cultureIndexImpl, chainId);
}

async function ingestContestBuilderEntities() {
  // loop over CONTEST_BUILDER_ADDRESSES
  const chainIds = Object.keys(CONTEST_BUILDER_ADDRESSES).map(Number);

  for (const chainId of chainIds) {
    await EntityTrackers().createEntityTracker(
      null,
      CONTEST_BUILDER_ADDRESSES[chainId],
      "contest_builder",
      chainId,
      CONTEST_BUILDER_ADDRESSES[chainId],
      (await getAbiForImplementation(CONTEST_BUILDER_ADDRESSES[chainId], chainId)) as AbiItem[],
    );
  }
}
