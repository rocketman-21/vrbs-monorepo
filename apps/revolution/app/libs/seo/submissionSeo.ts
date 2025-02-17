import { ISubmission, Serialized } from "@cobuild/database/types";
import { Metadata } from "next";
import { generateOpenGraphSeoContent } from "./utils/opengraphSeoMetadata";
import { generateTwitterSeoContent } from "./utils/twitterSeoMetadata";
import { shortenIfEthAddress } from "@cobuild/libs/utils/account";

export const getSubmissionSeo = (
  submission: Serialized<ISubmission, "creatorProfiles">,
  revolutionId: string,
  subtitle?: string,
): Metadata => {
  const {
    name,
    mediaMetadata,
    thumbnailUrl,
    creatorProfiles,
    description: submissionDescription,
  } = submission;
  const description = subtitle || submissionDescription || "";

  if (!mediaMetadata)
    return {
      title: "Submission not found",
      description: "Submission not found",
    };

  const creator = creatorProfiles[0];

  const { width, height } = mediaMetadata;

  const title = `${name} by ${shortenIfEthAddress(creator?.username)}`;

  const twitter = generateTwitterSeoContent(
    title,
    description,
    //don't allow video cross platform for now to encourage more site visitors
    undefined,
    undefined,
    undefined,
    width,
    height,
  );

  const openGraph = generateOpenGraphSeoContent(thumbnailUrl, width, height, undefined);

  return {
    title,
    description,
    openGraph,
    twitter,
  };
};
