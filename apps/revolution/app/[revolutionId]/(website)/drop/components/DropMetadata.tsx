import "server-only";

import classNames from "classnames";
import { DropMedia } from "./DropMedia";
import { getDrop } from "./getDrop";
import { serializeSync } from "@cobuild/database/utils";

interface Props {
  revolutionId: string;
  tokenId: string;
}

export const DropMetadata = async (props: Props) => {
  const { revolutionId, tokenId } = props;

  const drop = await getDrop(revolutionId, tokenId);

  const { isVertical } = drop.submission?.layout || {};

  return (
    <div
      className={classNames("flex justify-center", {
        "m-auto w-full max-w-[420px]": isVertical,
      })}
    >
      {drop && (
        <DropMedia
          submission={drop.submission ? serializeSync(drop.submission) : null}
          metadata={drop.metadata}
        />
      )}
    </div>
  );
};
