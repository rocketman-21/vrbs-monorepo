import { database } from "@cobuild/database";
import { EntityTrackers } from "@cobuild/database/models/eth/EntityTrackers";
import { getEthAddress } from "@cobuild/libs/utils/account";
import { OnchainEvent, Prisma } from "prisma-database";
import { getAbiForImplementation } from "../../../../events/utils/AbiMapping";
import { getRevolutionBuilderImplementations } from "@cobuild/libs/web3/viem/utils/revolutionBuilder";
import { REVOLUTION_BUILDER_ADDRESSES } from "@cobuild/database/models/revolution/revolutions/addresses";
import { AbiItem } from "viem";

interface BaseContestDeployed {
  contest: `0x${string}`;
  cultureIndex: `0x${string}`;
}

export const upsertContest = async (
  args: BaseContestDeployed,
  event: OnchainEvent,
): Promise<string> => {
  const { chainId } = event;
  const address = getEthAddress(args.contest);

  const cultureIndex = getEthAddress(args.cultureIndex);

  const implementations = await getRevolutionBuilderImplementations(
    REVOLUTION_BUILDER_ADDRESSES[chainId],
    chainId,
  );

  const implementationContract = implementations.cultureIndexImpl;

  await EntityTrackers().createEntityTracker(
    null,
    cultureIndex,
    "culture_index",
    chainId,
    implementationContract.toLowerCase(),
    (await getAbiForImplementation(implementationContract, chainId)) as AbiItem[],
  );

  const doc: Prisma.ContestCreateInput = {
    chainId,
    address,
    cultureIndexAddress: cultureIndex,
    revolutionId: "unknown", // TODO - set as "unknown" for now
  };

  await database.contest.upsert({
    where: { chainId_address: { chainId, address } },
    create: doc,
    update: doc,
  });

  console.log(`Upserted contest for ${address} and chainId ${chainId}`);

  return address;
};
