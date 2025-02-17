import { revolutionTokenAbi } from "@cobuild/revolution";
import { unstable_cache } from "next/cache";
import { getAddress, getContract } from "viem";
import { reportApiError } from "../../utils/apiError";
import { getErrorMessage } from "../../utils/error";
import { getClient } from "../viem/clients";

export async function getAuctionSplits(args: {
  amount: number;
  creatorRateBps: number;
  entropyRateBps: number;
  tokenContract: string;
  chainId: number;
  ethPaidToCreators: bigint;
  pointsPaidToCreators: bigint;
  tokenId: string;
}) {
  try {
    const {
      amount,
      creatorRateBps,
      entropyRateBps,
      tokenContract,
      chainId,
      tokenId,
      ethPaidToCreators,
      pointsPaidToCreators,
    } = args;

    const creators = await getCreators(tokenContract, chainId, tokenId);

    return calculateAuctionSplits(
      amount,
      creatorRateBps || 0,
      entropyRateBps || 0,
      ethPaidToCreators,
      pointsPaidToCreators,
      creators,
    );
  } catch (e) {
    reportApiError(e, { args }, "get-auction-splits");
    throw new Error(getErrorMessage(e) || `Error fetching auction splits`);
  }
}

const getCreators = unstable_cache(
  async (tokenContract: string, chainId: number, tokenId: string) => {
    const contract = getContract({
      address: getAddress(tokenContract),
      abi: revolutionTokenAbi,
      client: { public: getClient(chainId) },
    });
    const { creators } = await contract.read.getArtPieceById([BigInt(tokenId)]);
    return creators.map(c => ({ address: c.creator, bps: Number(c.bps) }));
  },
  undefined,
  { revalidate: 600, tags: ["auction-item-creators"] },
);

function calculateAuctionSplits(
  amount: number,
  creatorRateBps: number,
  entropyRateBps: number,
  ethPaidToCreators: bigint,
  pointsPaidToCreators: bigint,
  creators: { address: `0x${string}`; bps: number }[],
) {
  const daoBps = 10000 - creatorRateBps;
  const daoPayment = (amount * daoBps) / 10000;

  const creatorsPayment = amount - daoPayment;
  const creatorsDirectPayment =
    Number(ethPaidToCreators) || (creatorsPayment * entropyRateBps) / 10000;
  const creatorsGovernancePayment = creatorsPayment - creatorsDirectPayment;

  return {
    amount,
    creatorRateBps,
    entropyRateBps,
    dao: {
      bps: daoBps,
      payment: daoPayment,
    },
    creators: creators.map(({ address, bps }) => ({
      address,
      bps,
      directPayment: (creatorsDirectPayment * bps) / 10000,
      governancePayment: (creatorsGovernancePayment * bps) / 10000,
      points: (Number(pointsPaidToCreators) * bps) / 10000,
    })),
  };
}
