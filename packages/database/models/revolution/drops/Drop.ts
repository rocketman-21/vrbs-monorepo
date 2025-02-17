import "server-only";

import { Drop } from "prisma-database";
import { IDrop } from "./IDrop";
import { getEthAddress } from "@cobuild/libs/utils/account";

export function transformDrop(drop: Drop): IDrop {
  if (!drop.metadata) throw new Error("Drop has no metadata");
  if (!drop.saleConfig) throw new Error("Drop has no sale config");

  // handles zora salev2 (unreleased)
  const isMintOpenForever =
    Number(drop.saleConfig.saleEnd) > 2 ** 63 || Number(drop.saleConfig.saleEnd) === 0;

  return Object.assign(drop, {
    contract: getEthAddress(drop.contract),
    metadata: drop.metadata,
    saleConfig: drop.saleConfig,
    totalMinted: Number(drop.totalMinted),
    isMintOpenForever,
    isMintingOpen:
      isMintOpenForever || new Date() < new Date(Number(drop.saleConfig.saleEnd) * 1000),
    collectionOwner: getEthAddress(drop.collectionOwner),
  });
}
