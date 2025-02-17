import { database } from "@cobuild/database";
import omit from "lodash/omit";
import { OnchainEvent, CultureIndex } from "prisma-database";

interface CultureIndexDeployed {
  cultureIndex: `0x${string}`;
  maxHeap: `0x${string}`;
  votingPower: `0x${string}`;
}

export const upsertCultureIndex = async (
  args: CultureIndexDeployed,
  event: OnchainEvent,
): Promise<string> => {
  const doc: Omit<CultureIndex, "id"> = {
    chainId: event.chainId,
    transactionHash: event.transactionHash,
    address: args.cultureIndex.toLowerCase(),
    maxHeap: args.maxHeap.toLowerCase(),
    votingPower: args.votingPower.toLowerCase(),
    createdAt: new Date(),
  };

  /// @notice upserts the vote
  await database.cultureIndex.upsert({
    where: {
      chainId_address: {
        address: args.cultureIndex.toLowerCase(),
        chainId: event.chainId,
      },
    },
    create: doc,
    update: omit(doc, ["createdAt", "updatedAt"]),
  });

  console.log(`Upserted culture index for ${args.cultureIndex} and chainId ${event.chainId}`);

  return doc.address;
};
