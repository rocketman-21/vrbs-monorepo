import { GovernanceType } from "@cobuild/database/types";
import { getNftMetadata } from "@cobuild/libs/web3/alchemy/getNftMetadata";
import { generateAuctionUniqueId } from "@cobuild/libs/web3/auction/auction-uniqueid";
import { getClient } from "@cobuild/libs/web3/viem/clients";
import { auctionHouseAbi } from "@cobuild/revolution";
import { Auction, EntityTracker, OnchainEvent } from "prisma-database";
import { getAddress, getContract } from "viem";
import { getBlockTimestampForIngestion } from "../../../../utils/blockUtils";
import { IAuctionCreatedEvent } from "./getOrCreateAuction";

export const generateNounishAuction = async (
  args: IAuctionCreatedEvent,
  entity: EntityTracker,
  event: OnchainEvent,
  tokenContract: string,
  auctionContract: string,
  type: GovernanceType,
): Promise<Omit<Auction, "id">> => {
  const { chainId } = entity;

  if (!tokenContract || !auctionContract) {
    throw new Error(`Missing token contract or auction contract for entity tracker ${entity?.id}`);
  }

  const tokenId = args.tokenId.toString();
  const nftContractAddress = tokenContract.toLowerCase() as `0x${string}`;

  const metadata = await getNftMetadata({ tokenId, contractAddress: nftContractAddress, chainId });

  const name = metadata?.name || `${tokenId}`;

  const uniqueId = generateAuctionUniqueId(chainId, tokenId, tokenContract, auctionContract);

  const contract = getContract({
    address: getAddress(auctionContract),
    abi: auctionHouseAbi,
    client: { public: getClient(chainId) },
  });

  // This will cause inconsistencies until the specific change events are read if we rerun ingestion
  // TODO find better way to handle this
  const timeBuffer = await contract.read.timeBuffer();
  const reservePrice = await contract.read.reservePrice();
  const minBidIncrementPercentage = await contract.read.minBidIncrementPercentage();
  const auctionCreatedAt = await getBlockTimestampForIngestion(event.chainId, event.blockNumber);

  let creatorRateBps = null;
  let entropyRateBps = null;

  if (type === "revolution") {
    creatorRateBps = Number(await contract.read.creatorRateBps());
    entropyRateBps = Number(await contract.read.entropyRateBps());
  }

  console.log(`Creating auction for ${uniqueId} and ${name}`);

  const doc: Omit<Auction, "id"> = {
    nftTokenId: tokenId,
    acceptanceManifestoSpeech: null,
    nftContractAddress,
    settlementTransactionHash: null,
    type: type === "revolution" ? "revolution_v1" : "nouns",
    chainId: entity.chainId,
    winner: null,
    winningBid: null,
    createdAt: auctionCreatedAt,
    updatedAt: auctionCreatedAt,
    auctionContractAddress: auctionContract.toLowerCase(),
    name,
    pointsPaidToCreators: null,
    ethPaidToCreators: null,
    uniqueId,
    details: {
      startTime: new Date(Number(args.startTime) * 1000),
      endTime: new Date(Number(args.endTime) * 1000),
      sellerAddress: null,
      fundsRecipient: null,
    },
    timeBuffer: timeBuffer.toString(),
    reservePrice: reservePrice.toString(),
    minBidIncrementPercentage: minBidIncrementPercentage.toString(),
    creatorRateBps,
    entropyRateBps,
  };

  return doc;
};
