import { database } from "@cobuild/database";
import { Blocks } from "@cobuild/database/models/eth/Blocks";
import { generateOnchainPieceSubmissionSlug } from "@cobuild/database/models/revolution/submissions/set/createCreation";
import omit from "lodash/omit";
import { OnchainEvent, Upvote } from "prisma-database";

interface VoteCastArgs {
  pieceId: bigint;
  voter: `0x${string}`;
  weight: bigint;
  totalWeight: bigint;
}

export const upsertCultureIndexVote = async (
  args: VoteCastArgs,
  event: OnchainEvent,
): Promise<string> => {
  const { pieceId, voter: voterRaw, weight, totalWeight } = args;
  const voter = voterRaw.toLowerCase();

  const slug = generateOnchainPieceSubmissionSlug(
    event.chainId,
    event.address as `0x${string}`,
    pieceId.toString(),
  );
  const createdAt = await Blocks().getBlockTimestamp(event.blockNumber, event.chainId);

  await database.submission.update({
    where: { slug },
    data: { votesWeight: Number(totalWeight) },
  });

  const doc: Omit<Upvote, "id"> = {
    weight: Number(weight),
    strategy: "culture-index-v1",
    chainId: event.chainId,
    version: 1,
    snapshot: event.blockNumber,
    networkAddress: event.address.toLowerCase(),
    slug,
    uniqueId: `${slug}-${voter}`,
    createdAt,
    updatedAt: createdAt,
    stale: false,
    voter,
  };

  /// @notice upserts the vote
  await database.upvote.upsert({
    where: { uniqueId: doc.uniqueId },
    create: doc,
    update: omit(doc, ["createdAt", "updatedAt", "stale"]),
  });

  console.log(
    `Updated votes on submission ${slug} for piece ${pieceId} with new weight ${totalWeight}`,
  );

  return `${totalWeight}`;
};
