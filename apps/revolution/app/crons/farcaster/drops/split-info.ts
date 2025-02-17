import { getClient } from "@cobuild/libs/web3/viem/clients";
import { splitMainAbi } from "@cobuild/splits";
import { getContract } from "viem";
import { SplitsClient } from "@0xsplits/splits-sdk";
import { unstable_cache } from "next/cache";

export async function getSplitInfo(
  address: `0x${string}`,
  chainId: number,
  splitMainAddress: `0x${string}`,
): Promise<number> {
  try {
    // if the rewards recipient is a split contract on revolution, we pull that
    const vanillaRevolutionSplit = await pullRevolutionSplitsInfo(
      address,
      chainId,
      splitMainAddress,
    );

    if (vanillaRevolutionSplit > BigInt(0)) {
      return vanillaRevolutionSplit;
    }

    // if the rewards recipient is a split contract on splits.org, containing a split on revolution, we pull that
    const stackedSplit = await pullSplitsOrgInfo(address, chainId, splitMainAddress);

    return stackedSplit;
  } catch (error) {
    return 0;
  }
}

const pullRevolutionSplitsInfo = unstable_cache(
  async (address: `0x${string}`, chainId: number, splitMainAddress: `0x${string}`) => {
    const client = getClient(chainId);

    const contract = getContract({
      abi: splitMainAbi,
      address: splitMainAddress,
      client,
    });

    const pointsPercentBps = await contract.read.getPointsPercent([address]);

    return pointsPercentBps;
  },
  undefined,
  { revalidate: 60 * 60 },
);

async function pullSplitsOrgInfo(
  recipientAddress: `0x${string}`,
  chainId: number,
  splitMainAddress: `0x${string}`,
) {
  const splitsClient = createSplitsClient(chainId);

  if (!splitsClient) {
    console.error("Error getting splits client");
    return 0;
  }

  const split = await splitsClient.getSplitMetadata({
    chainId,
    splitAddress: recipientAddress,
  });

  const possibleSplits = await Promise.all(
    split.recipients.map(async recipient => {
      const pointsPercentBps = await pullRevolutionSplitsInfo(
        recipient.recipient.address,
        chainId,
        splitMainAddress,
      );
      return (pointsPercentBps * Number(recipient.ownership)) / 1e6;
    }),
  );

  return possibleSplits.reduce((a, b) => a + b, 0);
}

const createSplitsClient = (chainId: number) =>
  new SplitsClient({
    chainId,
    apiConfig: {
      apiKey: `${process.env.SPLITS_API_KEY}`,
    },
  }).dataClient;
