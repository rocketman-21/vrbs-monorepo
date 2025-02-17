"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { PropsWithChildren } from "react";
import clsx from "classnames";

interface Props {
  ideaId: string;
}

export const IdeaItemCard = (props: PropsWithChildren<Props>) => {
  const { children, ideaId } = props;

  const selectedIdeaId = useSelectedLayoutSegment();

  return (
    <article
      className={clsx("flex items-center rounded-xl", {
        "bg-card": selectedIdeaId !== ideaId,
        "bg-lead-100 dark:bg-zinc-800": selectedIdeaId === ideaId,
        "max-md:hidden": selectedIdeaId !== null,
      })}
    >
      {children}
    </article>
  );
};
