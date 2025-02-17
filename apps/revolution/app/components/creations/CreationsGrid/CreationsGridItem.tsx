"use client";

import { IContest } from "@cobuild/database/models/revolution/contests/IContest";
import { ISubmission, Serialized } from "@cobuild/database/types";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { useRevolution } from "app/libs/useRevolution";
import classNames from "classnames";
import { CreationAction } from "../CreationItem/CreationAction";
import { CreationContent } from "../CreationItem/CreationContent";
import { CreationContestReward } from "../CreationItem/CreationContestReward";
import { CreationFooter } from "../CreationItem/CreationFooter";
import { CreationRank } from "../CreationItem/CreationRank";

interface Props {
  submission: Serialized<ISubmission, "creatorProfiles">;
  rank?: number;
  contest?: IContest;
}

export const CreationsGridItem = (props: Props) => {
  const { submission, rank, contest } = props;
  const { revolutionId, config } = useRevolution();

  const { creationOrientation = "square" } = config;

  const creator = submission.creatorProfiles[0];

  return (
    <div className="relative flex max-h-[740px] flex-col overflow-hidden rounded-lg border border-zinc-100 dark:border-zinc-800">
      {creationOrientation === "vertical" && (
        <div className="pointer-events-none absolute left-2 top-2 z-10 flex items-center space-x-1.5 md:left-4">
          <Avatar imageUrl={creator.profilePicture} size={16} id={creator.address} />
          <span className="truncate text-[11px] md:text-[13px]">{creator.displayUsername}</span>
        </div>
      )}

      <CreationContent
        play={false}
        mediaType={submission.mediaMetadata?.type || "video"}
        name={submission.name}
        customControls
        thumbnailOnly
        url={submission.url}
        videoUrl={submission.videoUrl}
        streamUrl={submission.streamUrl}
        thumbnail={submission.thumbnailUrl}
        className={classNames("duration-150 ease-in-out", {
          "aspect-video hover:opacity-80": creationOrientation === "horizontal",
          "aspect-[9/16] hover:scale-110": creationOrientation === "vertical",
          "aspect-square hover:opacity-80": creationOrientation === "square",
        })}
        creationUrl={`/${revolutionId}/creations/${submission.slug}`}
        objectFit={creationOrientation === "vertical" ? "cover" : "contain"}
      />

      {rank && !contest && <CreationRank rank={rank} />}
      {rank && contest && <CreationContestReward rank={rank} contest={contest} />}

      {creationOrientation !== "vertical" && (
        <CreationFooter submission={submission} revolutionId={revolutionId} />
      )}

      {creationOrientation === "vertical" && (
        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-end bg-gradient-to-b from-black/0 to-black/70 p-3">
          <CreationAction submission={submission} revolutionId={revolutionId} />
        </div>
      )}
    </div>
  );
};
