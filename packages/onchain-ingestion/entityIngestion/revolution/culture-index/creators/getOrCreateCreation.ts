import { Blocks } from "@cobuild/database/models/eth/Blocks";
import { Submissions } from "@cobuild/database/models/revolution/submissions/Submissions";
import { convertIpfsToHttp } from "@cobuild/libs/web3/utils";
import { CultureIndexMediaType } from "@cobuild/libs/web3/revolution/types";
import { OnchainEvent, Submission, MediaType } from "prisma-database";
import { database } from "@cobuild/database";
import { getAbsoluteUrl } from "@cobuild/libs/utils/url";

interface PieceCreatedArgs {
  pieceId: bigint;
  sponsor: `0x${string}`;
  metadata: {
    name: string;
    description: string;
    image: string;
    animationUrl: string;
    text: string;
    mediaType: number;
    tokenURI?: string;
  };
  creators: readonly {
    creator: `0x${string}`;
    bps: bigint;
  }[];
}

export const upsertCreation = async (
  args: PieceCreatedArgs,
  event: OnchainEvent,
): Promise<string | undefined> => {
  const { pieceId, sponsor, metadata, creators } = args;
  const { name, image, animationUrl, text, mediaType, description, tokenURI } = metadata;
  const contractAddress = event.address.toLowerCase();

  const mediaEnum = CultureIndexMediaType[mediaType] as keyof typeof CultureIndexMediaType;

  const url = animationUrl || image;

  if (!url) {
    console.error(`Skipping because no image or animationUrl`);
    return;
  }
  if (!url.startsWith("ipfs://") && !url.includes("data:image/svg+xml;base64,")) {
    console.error(`Skipping because no ipfs in image or animationUrl`);
    return;
  }

  const createdAt = await Blocks().getBlockTimestamp(event.blockNumber, event.chainId);

  const submission = await Submissions().createCreation(
    {
      name,
      creators: creators.map(creator => ({
        address: creator.creator.toLowerCase(),
        bps: Number(creator.bps),
      })),
      description,
      body: text,
      chainId: event.chainId,
      url: convertIpfsToHttp(url),
      logicContractVersion: "v1",
      contractAddress: contractAddress,
      pieceId: pieceId.toString(),
      mediaMetadata: {
        type: getMediaType(mediaEnum),
        //TODO get image sizes - mux will take care of videos
        width: null,
        height: null,
        thumbnailIpfs: convertIpfsToHttp(image),
      },
      tokenURI: tokenURI,
      isOnchain: true,
      createdAt,
    },
    sponsor,
  );

  await handleUpdateOffchain(submission, event.chainId);

  console.log(
    `Created submission ${submission.id} with slug ${submission.slug} for piece ${pieceId}`,
  );

  return submission.slug;
};

const handleUpdateOffchain = async (submission: Submission, chainId: number) => {
  //TODO update this to scope by DAO contract address
  const offchainSubmission = await database.submission.findFirst({
    where: {
      OR: [{ pieceId: null }, { pieceId: { isSet: false } }],
      name: submission.name,
      chainId,
      url: submission.url,
      creators: {
        some: {
          address: submission.creators[0].address.toLowerCase(),
        },
      },
    },
  });

  if (offchainSubmission) {
    // set onchain slug on offchain submission
    await database.submission.update({
      where: {
        id: offchainSubmission.id,
      },
      data: {
        onchainSlug: submission.slug,
      },
    });
    if (submission.mediaMetadata?.type === "video") {
      // set muxStreamData and muxStreamUrl and thumbnailUrl on onchain submission
      await database.submission.update({
        where: {
          id: submission.id,
        },
        data: {
          muxStreamData: offchainSubmission.muxStreamData,
          muxStreamUrl: offchainSubmission.muxStreamUrl,
          thumbnailUrl: offchainSubmission.thumbnailUrl,
          mediaMetadata: offchainSubmission.mediaMetadata,
        },
      });
    }
  } else if (submission.mediaMetadata?.type === "video") {
    //upload to mux right after
    fetch(getAbsoluteUrl(`/crons/submissions/mux-upload/by-slug?slug=${submission.slug}`), {
      cache: "no-store",
    });
  }
};

const getMediaType = (mediaEnum: keyof typeof CultureIndexMediaType): MediaType | null => {
  if (mediaEnum === "IMAGE") {
    return "image";
  }
  if (mediaEnum === "ANIMATION") {
    return "video";
  }
  if (mediaEnum === "TEXT") {
    return "text";
  }
  if (mediaEnum === "AUDIO") {
    return "audio";
  }

  return null;
};
