"use client";

import { createReactBlockSpec } from "@blocknote/react";
import { AspectRatioTypeEnum } from "@cobuild/libs/media/AspectRatio";
import { IframeVideoPlayer } from "@cobuild/ui/molecules/IframeVideoPlayer/IframeVideoPlayer";

export const PlatformPlayerBlock = createReactBlockSpec(
  {
    type: "platformPlayer",
    propSchema: {
      url: { default: `` },
      embedUrl: { default: `` },
      thumbnailUrl: { default: `` },
      aspectRatio: { default: AspectRatioTypeEnum.Horizontal },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => {
      const { aspectRatio, embedUrl, thumbnailUrl } = block.props;
      const { isEditable } = editor;

      if (embedUrl) {
        return (
          <div className="mx-auto w-full max-w-3xl">
            <IframeVideoPlayer
              embedUrl={embedUrl}
              aspectRatio={aspectRatio as AspectRatioTypeEnum}
              thumbnailUrl={thumbnailUrl}
              autoplay={false}
            />
          </div>
        );
      }

      return null;
    },
  },
);
