import { database } from "@cobuild/database";
import Mux from "@mux/mux-node";
import { getStreamUrl, getThumbnailUrl, getVideoDimensions } from "app/libs/mux";
import { Submission } from "prisma-database";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID as string,
  tokenSecret: process.env.MUX_TOKEN_SECRET as string,
});

export const uploadSubmissionToMux = async (submission: Submission) => {
  if (submission.muxStreamUrl || !submission.url || submission?.mediaMetadata?.type === "image")
    return;

  if (!submission.muxStreamData || (submission.muxStreamData as any).status === "errored") {
    console.log("attempting reupload of submission", submission.slug);

    const asset = await mux.video.assets.create({
      input: [{ url: convertToIpfsNftStorageLink(submission.url) }],
      playback_policy: ["public"],
      mp4_support: "standard",
    });

    //update submission
    await database.submission.update({
      where: { id: submission.id },
      data: { muxStreamData: asset as any },
    });

    //check mux for asset
    await checkMuxForAsset(asset.id, submission.id);
  }

  //check mux for asset
  if (submission.muxStreamData) {
    await checkMuxForAsset((submission.muxStreamData as any)["id"], submission.id);
  }
};

const checkMuxForAsset = async (assetId: string, id: string) => {
  while (true) {
    const asset = await mux.video.assets.retrieve(assetId);

    await database.submission.update({
      where: { id },
      data: { muxStreamData: asset as any },
    });

    if (asset.status === "ready") {
      await database.submission.update({
        where: { id },
        data: {
          muxStreamUrl: getStreamUrl(asset),
          muxStreamData: asset as any,
          mediaMetadata: { ...getVideoDimensions(asset), type: "video" },
          thumbnailUrl: getThumbnailUrl(asset),
        },
      });

      break;
    }

    if (asset.status === "errored") {
      console.error({ error: asset });
      break;
    }

    // Sleep 2 seconds and check again
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
};

//if format is https://nftstorage.link/ipfs/bafybeiao6em7mfvm4xjb32eftaa5fyyapyz3gby3exzgqljwwbbknon7va
//convert to https://bafybeiao6em7mfvm4xjb32eftaa5fyyapyz3gby3exzgqljwwbbknon7va.ipfs.nftstorage.link
const convertToIpfsNftStorageLink = (url: string) => {
  const match = url.match(/https:\/\/nftstorage.link\/ipfs\/(.*)/);
  if (match) {
    const cid = match[1];
    return `https://${cid}.ipfs.nftstorage.link`;
  }
  return url;
};
