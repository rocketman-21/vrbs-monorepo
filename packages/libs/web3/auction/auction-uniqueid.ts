export function generateAuctionUniqueId(
  chainId: number,
  nftTokenId: string,
  tokenContract: string,
  auctionContract: string,
) {
  if (!tokenContract || !auctionContract) {
    throw new Error(
      `Missing token contract or auction contract for entity tracker ${chainId}-${nftTokenId}-${tokenContract}-${auctionContract}`,
    );
  }

  return `ethereum-${chainId}-${tokenContract.toLowerCase()}-${auctionContract.toLowerCase()}-${nftTokenId}`;
}
