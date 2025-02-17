import { ISubmission, Serialized } from "@cobuild/database/types";
import { Metadata } from "next";
import { generateOpenGraphSeoContent } from "./utils/opengraphSeoMetadata";
import { generateTwitterSeoContent } from "./utils/twitterSeoMetadata";
import { shortenIfEthAddress } from "@cobuild/libs/utils/account";
import { IGoal } from "@cobuild/database/models/revolution/goals/IGoal";

export const getGoalSeo = (goal: IGoal): Metadata => {
  const { title, description, image } = goal;

  const twitter = generateTwitterSeoContent(
    title,
    description,
    //don't allow video cross platform for now to encourage more site visitors
    undefined,
    undefined,
    undefined,
    500,
    500,
  );

  const openGraph = generateOpenGraphSeoContent(image.url, 500, 500, undefined);

  return {
    title,
    description,
    openGraph,
    twitter,
  };
};
