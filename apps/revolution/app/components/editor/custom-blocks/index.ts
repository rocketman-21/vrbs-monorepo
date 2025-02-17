import {
  Block,
  BlockSchemaFromSpecs,
  BlockSpecs,
  InlineContentSchema,
  StyleSchema,
  defaultBlockSpecs,
} from "@blocknote/core";
import { GalleryBlock } from "./Gallery";
import { MediaBlock } from "./Media";
import { PlatformPlayerBlock } from "./PlatformPlayer";
import { QuoteBlock } from "./Quote";

// Register custom blocks
export const blockSpecs = {
  ...defaultBlockSpecs,
  media: MediaBlock,
  gallery: GalleryBlock,
  quote: QuoteBlock,
  platformPlayer: PlatformPlayerBlock,
} satisfies BlockSpecs;

export type EditorBlock = Block<
  BlockSchemaFromSpecs<typeof blockSpecs>,
  InlineContentSchema,
  StyleSchema
>;
