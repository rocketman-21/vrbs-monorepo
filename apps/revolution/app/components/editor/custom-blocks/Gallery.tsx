import { createReactBlockSpec } from "@blocknote/react";
import { Media } from "@cobuild/database/types";
import { Grid } from "./Grid";
import { MediaItem } from "./MediaItem";

export const GalleryBlock = createReactBlockSpec(
  {
    type: "gallery",
    propSchema: {
      items: { default: "[]" },
      caption: { default: "" },
    },
    content: "none",
  },
  {
    render: ({ block }) => {
      const { caption, items } = block.props;
      const medias = (JSON.parse(items) || []) as Media[];

      if (medias.length === 0) return null;

      return (
        <Grid caption={caption}>
          {medias.map(media => (
            <div className="group relative h-full" key={media.id}>
              <MediaItem media={media} fullWidth />
            </div>
          ))}
        </Grid>
      );
    },
  },
);
