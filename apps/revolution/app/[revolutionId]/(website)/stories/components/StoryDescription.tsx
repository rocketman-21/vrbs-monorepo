"use client";

import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("app/components/editor/Editor"), { ssr: false });

interface Props {
  body: string;
  description: string | null;
  revolutionId: string;
}

export function StoryDescription(props: Props) {
  const { body, revolutionId, description } = props;

  const deprecatedContent = JSON.parse(body);

  if (deprecatedContent.length > 0) {
    const { darkMode } = getRevolutionConfig(revolutionId);

    return (
      <Editor
        initialContent={deprecatedContent}
        theme={darkMode ? "dark" : "light"}
        editable={false}
      />
    );
  }

  return (
    <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-800 dark:text-zinc-50">
      {description}
    </p>
  );
}
