"use client";

import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { PinataStorage } from "@cobuild/libs/storage/Pinata";
import { useEffect, useState } from "react";
import styles from "./MarkdownEditor.module.css";

type Props = {
  theme: "light" | "dark";
  initialContent?: string;
  onUpdate?: (content: string) => void;
  onBlur?: () => void;
  editable?: boolean;
};

export default function MarkdownEditor(props: Props) {
  const { theme, initialContent, onUpdate, editable = true, onBlur } = props;

  const [isInitialized, setIsInitialized] = useState(initialContent ? false : true);

  const editor = useCreateBlockNote({
    domAttributes: {
      block: { class: styles.blockContainer },
      blockGroup: { class: "space-y-4" },
    },
    defaultStyles: false,
    uploadFile: async (file: File) => {
      return (await PinataStorage.upload(file)).url;
    },
  });

  useEffect(() => {
    if (!editor || !initialContent) return;
    editor.tryParseMarkdownToBlocks(initialContent).then(blocks => {
      editor.replaceBlocks(editor.document, blocks);
      setIsInitialized(true);
    });
  }, [editor, initialContent]);

  return (
    <BlockNoteView
      editor={editor}
      editable={editable}
      onChange={() => {
        if (!isInitialized) return; // Do not fire onUpdate event with initialContent
        onUpdate && editor.blocksToMarkdownLossy(editor.document).then(onUpdate);
      }}
      theme={theme}
      onBlur={onBlur}
      className={styles.bnContainer}
    />
  );
}
