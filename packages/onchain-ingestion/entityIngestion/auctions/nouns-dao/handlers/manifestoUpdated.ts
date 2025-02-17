import { database } from "@cobuild/database";
import { deleteCacheResult } from "@cobuild/libs/cache";
import { generateAuctionUniqueId } from "@cobuild/libs/web3/auction/auction-uniqueid";
import { OnchainEvent } from "prisma-database";

interface EventArgs {
  tokenId: bigint;
  speech: string;
}

export async function handleManifestoUpdated(
  args: EventArgs,
  event: OnchainEvent,
  tokenContract: string,
) {
  const { tokenId, speech } = args;

  const auctionContractAddress = event.address.toLowerCase();

  const uniqueId = generateAuctionUniqueId(
    event.chainId,
    tokenId.toString(),
    tokenContract,
    auctionContractAddress,
  );

  const auction = await database.auction.update({
    where: { uniqueId },
    data: {
      updatedAt: new Date(),
      acceptanceManifestoSpeech: speech,
    },
  });

  await deleteCacheResult(uniqueId);

  return auction;
}
