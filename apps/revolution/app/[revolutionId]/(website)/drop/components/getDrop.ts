import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { Submissions } from "@cobuild/database/models/revolution/submissions/Submissions";
import { getDropInfo } from "@cobuild/libs/web3/zora-drop/drop-info";
import { unstable_cache } from "next/cache";

export const getDrop = unstable_cache(
  async (revolutionId: string, tokenId: string) => {
    const revolution = await Revolutions().getById(revolutionId);
    if (!revolution) throw new Error("Invalid revolution");

    const { chainId, addresses } = revolution;
    if (!addresses || !addresses.drop) throw new Error("Invalid revolution");

    const drop = await getDropInfo(addresses.drop, chainId, tokenId);
    if (!drop) throw new Error("Invalid drop");

    const submission = await Submissions().getByTokenURI(drop.tokenURI);

    return { ...drop, submission, totalMinted: Number(drop.totalMinted) };
  },
  undefined,
  { revalidate: 60, tags: ["drop"] },
);
