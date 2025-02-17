"use client";

import { ISubmission, Serialized } from "@cobuild/database/types";
import { CultureIndexMediaType } from "@cobuild/libs/web3/revolution/types";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { updateOffchainSubmission } from "app/components/creations/PostCreationModal/updateOffchainSubmission";
import { useOnchainPublish } from "app/components/creations/PostCreationModal/useOnchainPublish";
import { useRevolution } from "app/libs/useRevolution";
import { useRouter } from "next/navigation";

export function useSponsorCreation(
  submission: Serialized<ISubmission>,
  contractAddress: `0x${string}`,
) {
  const { revolutionId, chainId } = useRevolution();
  const router = useRouter();

  const { name, description, url, mediaType, creators, isOnchain, hasBeenDropped, onchainSlug } =
    submission;

  const { createPiece, status } = useOnchainPublish({
    contractAddress,
    chainId: submission.chainId || chainId,
    onSuccess: async (_: string, slug?: string) => {
      if (!slug) {
        toast.loading("Art piece will show up on the website within 2 minutes.", {
          duration: 10000,
        });
        return;
      }

      const res = await updateOffchainSubmission({
        revolutionId,
        data: {
          onchainSlug: slug,
          offchainSlug: submission.slug,
          name: submission.name,
          creators: submission.creators,
          description: submission.description ?? undefined,
          url: submission.url,
          // split at the last ":" and take the last part to get the pieceId out of the slug
          onchainPieceId: slug.split(":").pop() ?? "",
        },
      });

      if (res.error) {
        toast.error(res.error);
        return;
      }

      router.push(`/${revolutionId}/creations/${slug}`);
    },
  });

  const metadata = {
    name,
    description: description || "",
    animationUrl: mediaType === "video" ? url : "",
    image: mediaType === "image" ? url : "",
    mediaType:
      mediaType === "video" ? CultureIndexMediaType.ANIMATION : CultureIndexMediaType.IMAGE,
    text: "",
  };

  const sponsorPiece = async () => {
    if (isOnchain || hasBeenDropped || onchainSlug) {
      throw new Error("Cannot sponsor onchain piece");
    }

    await createPiece(metadata, creators);
  };

  const responsorPiece = async () => {
    if (hasBeenDropped) throw new Error("Cannot re-sponsor a piece that has been dropped");
    if (!isOnchain) throw new Error("Cannot re-sponsor offchain piece");

    await createPiece(metadata, creators);
  };

  return { sponsorPiece, responsorPiece, status };
}
