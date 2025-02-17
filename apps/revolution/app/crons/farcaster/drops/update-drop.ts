import { database } from "@cobuild/database";
import { logTime } from "@cobuild/libs/log-time";
import { getEthAddress } from "@cobuild/libs/utils/account";
import { getDropInfo } from "@cobuild/libs/web3/zora-drop/drop-info";
import { Drop } from "prisma-database";
import { getSplitInfo } from "./split-info";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";

export async function updateDrop(drop: Drop) {
  const currentTime = Date.now();

  const { chainId, contract, tokenId, revolutionId } = drop;

  const revolution = await Revolutions().getById(revolutionId);

  if (!revolution?.addresses?.splitsCreator) {
    throw new Error("Revolution splits creator address not found");
  }

  const address = getEthAddress(contract);

  const { metadata, saleConfig, creatorRewardRecipient, totalMinted, collectionOwner } =
    (await getDropInfo(address, chainId, tokenId)) || {};

  if (!metadata || !saleConfig || !creatorRewardRecipient) {
    console.error("No metadata, saleConfig, or creatorRewardRecipient found for drop", drop);
    throw new Error("No metadata, saleConfig, or creatorRewardRecipient found for drop");
  }

  const splitToDAOBps = await getSplitInfo(
    creatorRewardRecipient,
    chainId,
    revolution.addresses.splitsCreator,
  );

  await database.drop.update({
    where: { id: drop.id },
    data: {
      metadata,
      saleConfig,
      collectionOwner,
      totalMinted,
      creatorRewardRecipient,
      splitToDAOBps,
    },
  });

  logTime(`Zora drop ${drop.url} updated`, currentTime);
}
