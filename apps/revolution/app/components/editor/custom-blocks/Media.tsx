"use client";

import { createReactBlockSpec } from "@blocknote/react";
import { Media } from "@cobuild/database/types";
import clsx from "classnames";
import { MediaItem } from "./MediaItem";

export const MediaBlock = createReactBlockSpec(
  {
    type: "media",
    propSchema: {
      item: { default: `{}` },
      caption: { default: "" },
      fullWidth: { default: "no" },
    },
    content: "none",
  },
  {
    render: ({ block }) => {
      const { caption, item, fullWidth } = block.props;

      const media = (JSON.parse(item) || {}) as Media;

      if (media && media.id) {
        return (
          <div className="w-full max-w-full text-center">
            <div
              className={clsx("group relative mx-auto inline-flex max-w-full flex-col", {
                "w-full px-3 md:px-6": fullWidth === "yes",
              })}
            >
              <MediaItem media={media} fullWidth={fullWidth === "yes"} />
              {caption && (
                <span
                  className="dark:text-lead-50 mx-auto mt-2.5 min-w-[128px] text-center text-xs opacity-80 md:text-sm"
                  style={{ maxWidth: media.width || 320 }}
                >
                  {caption}
                </span>
              )}
            </div>
          </div>
        );
      }

      return null;
    },
  },
);
