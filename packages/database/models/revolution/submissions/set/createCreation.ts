import { deleteCacheResult } from "@cobuild/libs/cache";
import { getAbsoluteUrl } from "@cobuild/libs/utils/url";
import omit from "lodash/omit";
import { revalidateTag } from "next/cache";
import { Prisma } from "prisma-database";
import slugify from "slugify";
import { database } from "../../../..";

export const generateOnchainPieceSubmissionSlug = (
  chainId: number,
  contractAddress: `0x${string}`,
  pieceId: string,
) => `${chainId}:${contractAddress}:${pieceId}`;

export const createCreation = async (
  data: Omit<Prisma.SubmissionCreateInput, "slug">,
  sponsorAddress: `0x${string}`,
) => {
  const { name, mediaMetadata, url, pieceId, chainId, contractAddress } = data;
  const slug =
    pieceId && contractAddress && chainId
      ? generateOnchainPieceSubmissionSlug(chainId, contractAddress as `0x${string}`, pieceId)
      : await generateUniqueSlug(name);

  const doc: Prisma.SubmissionUncheckedCreateInput = {
    ...data,
    slug,
    thumbnailUrl: mediaMetadata?.type === "image" ? url : null,
    muxStreamData: null,
    muxStreamUrl: null,
    sponsorAddress: sponsorAddress.toLowerCase(),
  };

  const submission = await database.submission.upsert({
    where: { slug },
    create: doc,
    update: omit(doc, ["slug", "isHidden"]),
  });

  for (const creator of submission.creators) {
    await deleteCacheResult(`submissions-public-${creator.address}`);
    await deleteCacheResult(`submissions-count-${creator.address}`);
  }
  revalidateTag(`submissions-${contractAddress}`);
  revalidateTag("submissions");

  if (mediaMetadata?.type === "video") {
    //upload to mux right after
    try {
      fetch(getAbsoluteUrl(`/crons/submissions/mux-upload/by-slug?slug=${slug}`));
    } catch (e: any) {
      console.error(e);
    }
  }

  return submission;
};

const generateUniqueSlug = async (name: string): Promise<string> => {
  const slug = slugify(name, { lower: true, strict: true });
  if (!slug) return `${Date.now().toString().slice(-6)}`;
  const alreadyExists = await database.submission.count({ where: { slug } });
  return alreadyExists ? `${slug}-${Date.now().toString().slice(-6)}` : slug;
};
