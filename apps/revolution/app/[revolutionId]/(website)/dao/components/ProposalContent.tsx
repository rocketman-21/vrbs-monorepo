"use client";

import { useIsDesktop } from "@cobuild/libs/hooks/useIsScreenSize";
import { PropsWithChildren } from "react";
import { Markdown } from "@cobuild/ui/atoms/Markdown";
import { Collapsable } from "@cobuild/ui/molecules/Collapsable/Collapsable";
import styles from "./ProposalContent.module.css";

export const ProposalContent = (props: PropsWithChildren) => {
  const { children } = props;

  const isDesktop = useIsDesktop();

  return (
    <Collapsable isEnabled={isDesktop} collapsedHeight="40vh" className="rounded-b-[20px]">
      <div className="rounded-b-5 p-4 pt-0 lg:p-6 lg:pt-0">
        <div
          className={`prose prose-a:text-d-primary prose-zinc prose-pre:bg-zinc-200 prose-pre:text-black dark:prose-pre:bg-zinc-950 dark:prose-pre:text-white dark:prose-invert max-w-none text-pretty ${styles.content}`}
        >
          <Markdown>{children?.toString() || ""}</Markdown>
        </div>
      </div>
    </Collapsable>
  );
};
