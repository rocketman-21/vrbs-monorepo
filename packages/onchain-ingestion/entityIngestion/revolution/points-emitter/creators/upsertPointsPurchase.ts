import { database } from "@cobuild/database";
import omit from "lodash/omit";
import { OnchainEvent, PointsPurchase } from "prisma-database";

interface PointsPurchaseArgs {
  buyer: `0x${string}`;
  payment: bigint;
  ownerAmount: bigint;
  protocolRewardsAmount: bigint;
  buyerTokensEmitted: bigint;
  founderTokensEmitted: bigint;
  founderDirectPayment: bigint;
  grantsDirectPayment: bigint;
}

export const upsertPointsPurchase = async (
  args: PointsPurchaseArgs,
  event: OnchainEvent,
): Promise<undefined> => {
  const doc: Omit<PointsPurchase, "id"> = {
    transactionHash: event.transactionHash,
    address: event.address.toLowerCase(),
    chainId: event.chainId,
    buyer: args.buyer.toLowerCase(),
    payment: args.payment.toString(),
    ownerAmount: args.ownerAmount.toString(),
    protocolRewardsAmount: args.protocolRewardsAmount.toString(),
    buyerTokensEmitted: args.buyerTokensEmitted.toString(),
    founderTokensEmitted: args.founderTokensEmitted.toString(),
    founderDirectPayment: args.founderDirectPayment.toString(),
    grantsDirectPayment: args.grantsDirectPayment.toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  /// @notice upserts the vote
  await database.pointsPurchase.upsert({
    where: {
      transactionHash: event.transactionHash,
      address: event.address.toLowerCase(),
      chainId: event.chainId,
      buyer: args.buyer.toLowerCase(),
    },
    create: doc,
    update: omit(doc, ["createdAt", "updatedAt", "stale"]),
  });

  console.log(`Upserted points purchase for buyer ${args.buyer} with payment ${args.payment}`);
};
