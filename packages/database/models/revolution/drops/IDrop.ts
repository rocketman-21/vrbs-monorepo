import { Drop } from "prisma-database";

export type IDrop = Drop & {
  metadata: Exclude<Drop["metadata"], null>;
  saleConfig: Exclude<Drop["saleConfig"], null>;
  contract: `0x${string}`;
  isMintingOpen: boolean;
  totalMinted: number;
  collectionOwner: `0x${string}`;
  isMintOpenForever: boolean;
};
