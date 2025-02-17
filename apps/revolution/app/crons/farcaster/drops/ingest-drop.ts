import { database } from "@cobuild/database";
import { getChain } from "@cobuild/libs/web3/utils";
import { getDropInfo } from "@cobuild/libs/web3/zora-drop/drop-info";
import { getSplitInfo } from "./split-info";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";

export async function ingestDrop(data: {
  chainId: number;
  contract: `0x${string}`;
  tokenId: string;
  revolutionId: string;
}) {
  const { chainId, contract, tokenId, revolutionId } = data;

  const revolution = await Revolutions().getById(revolutionId);

  const { metadata, saleConfig, collectionOwner, totalMinted, creatorRewardRecipient } =
    (await getDropInfo(contract, chainId, tokenId)) || {};

  const url = `https://zora.co/collect/${getChain(chainId).name.toLowerCase()}:${contract}/${tokenId}`;

  if (!collectionOwner || !totalMinted || !creatorRewardRecipient) {
    if (!totalMinted) {
      throw new Error("Total minted not found");
    }
    if (!creatorRewardRecipient) {
      throw new Error("Creator reward recipient not found");
    }
    if (!collectionOwner) {
      throw new Error("Collection owner not found");
    }
  }

  if (!revolution?.addresses?.splitsCreator) {
    throw new Error("Revolution splits creator address not found");
  }

  const splitToDAOBps = await getSplitInfo(
    creatorRewardRecipient,
    chainId,
    revolution?.addresses?.splitsCreator,
  );

  await database.drop.upsert({
    where: { url },
    create: {
      chainId,
      collectionOwner,
      creatorRewardRecipient,
      contract,
      totalMinted,
      tokenId,
      url,
      metadata,
      saleConfig,
      revolutionId,
      splitToDAOBps,
      hidden: false,
    },
    update: {},
  });
}
