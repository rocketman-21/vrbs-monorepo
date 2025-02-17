"use client";

import { ISubmission, Serialized } from "@cobuild/database/types";
import { useRevolution } from "app/libs/useRevolution";
import clsx from "classnames";
import { CreationContent } from "./CreationContent";
import { CreationFooter } from "./CreationFooter";

interface Props {
  submission: Serialized<ISubmission, "creatorProfiles">;
  isInView?: boolean;
  fullScreen?: boolean;
  className?: string;
  withFooter?: boolean;
  clickable?: boolean;
}

export const CreationItem = (props: Props) => {
  const { submission, isInView = true, fullScreen, withFooter, className = "", clickable } = props;
  const { revolutionId, config } = useRevolution();

  if (!submission) return null;

  const { width, height, layout } = submission;
  const { isHorizontal, isVertical, isSquare } = layout;

  return (
    <div
      className={clsx(
        "relative z-[5] inline-flex min-w-[320px] max-w-full flex-col overflow-hidden rounded-lg bg-black duration-300 max-sm:w-full md:ease-out",
        className,
        {
          "max-h-screen md:max-h-[75vh]": fullScreen,
          "md:min-w-[560px]": isHorizontal || isSquare,
        },
      )}
      style={{
        aspectRatio: `${width} / ${height}`,
        width: isHorizontal ? width : undefined,
        height: isVertical ? height : undefined,
      }}
    >
      <CreationContent
        play={isInView}
        mediaType={submission.mediaMetadata?.type || "video"}
        name={submission.name}
        url={submission.url}
        videoUrl={submission.videoUrl}
        streamUrl={submission.streamUrl}
        className={clsx({ "lg:min-h-[520px]": isVertical })}
        thumbnail={submission.thumbnailUrl}
        creationUrl={clickable ? `/${revolutionId}/creations/${submission.slug}` : undefined}
        objectFit={config.creationOrientation === "vertical" ? "cover" : "contain"}
      />

      {withFooter && <CreationFooter submission={submission} revolutionId={revolutionId} />}
    </div>
  );
};
