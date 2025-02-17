"use client";

import { BlockNoteSchema } from "@blocknote/core";
import { BlockNoteView, Theme, darkDefaultTheme, lightDefaultTheme } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import styles from "./Editor.module.css";
import { EditorBlock, blockSpecs } from "./custom-blocks";

type Props = {
  theme: "light" | "dark";
  initialContent?: EditorBlock[];
  editable: boolean;
};

const schema = BlockNoteSchema.create({
  blockSpecs,
});

export default function Editor(props: Props) {
  const { theme, initialContent, editable } = props;

  const editor = useCreateBlockNote({
    schema,
    initialContent:
      (initialContent?.filter(
        block => (block.type as string) !== "map" && (block.type as string) !== "drop",
      ) as any) || undefined,

    // Custom styles
    defaultStyles: false,
    domAttributes: {
      blockGroup: { class: "space-y-6" },
      block: { class: styles.blockContainer },
      inlineContent: { class: "mx-auto max-w-3xl" },
      blockContent: { class: "max-w-full" },
      editor: { class: !editable ? "!ps-0 !pe-0" : "" }, // Remove padding-inline when not editable
    },
  });

  return (
    <BlockNoteView
      editable={editable}
      editor={editor}
      theme={
        theme === "light"
          ? { light: lightTheme, dark: lightTheme }
          : { light: darkTheme, dark: darkTheme }
      }
    />
  );
}

const lightTheme = {
  ...lightDefaultTheme,
  colors: {
    ...lightDefaultTheme.colors,
    editor: {
      text: "#000",
      background: "transparent",
    },
  },
  fontFamily: "inherit",
} satisfies Theme;

const darkTheme = {
  ...darkDefaultTheme,
  colors: {
    ...darkDefaultTheme.colors,
    editor: {
      text: "#fff",
      background: "transparent",
    },
  },
  fontFamily: "inherit",
} satisfies Theme;
