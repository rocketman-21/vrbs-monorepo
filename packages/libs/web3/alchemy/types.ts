// Taken from https://github.com/alchemyplatform/alchemy-sdk-js/tree/master/src/types

export interface Nft {
  contract: NftContract;
  tokenId: string;
  name?: string;
  description?: string;
  image: NftImage;
  tokenUri?: string;
  timeLastUpdated: string;
  raw: NftRawMetadata;
}

export interface NftContract {
  address: string;
  name?: string;
  symbol?: string;
  totalSupply?: string;
}

interface NftImage {
  cachedUrl?: string;
  thumbnailUrl?: string;
  pngUrl?: string;
  contentType?: string;
  size?: number;
  originalUrl?: string;
}

interface NftRawMetadata {
  tokenUri?: string;
  metadata: Record<string, any>;
  error?: string;
}
