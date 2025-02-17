"use client";

import { Expandable } from "@cobuild/ui/atoms/Expandable";
import ChevronRight from "@cobuild/ui/pixel-icons/ChevronRight";
import { useLocalStorage } from "@cobuild/libs/hooks/useLocalStorage";
import clsx from "classnames";
import { PropsWithChildren } from "react";

interface Props {
  title: string;
  id: string;
  className?: string;
  isExpandible?: boolean;
}

export const ProposalSection = (props: PropsWithChildren<Props>) => {
  const { title, children, className, isExpandible = true, id } = props;
  const [isExpanded, setIsExpanded] = useLocalStorage(`proposal_section_${id}`, true);

  return (
    <div className={clsx("bg-card rounded-2xl p-4 lg:px-8 lg:py-6", className)} id={id}>
      {isExpandible ? (
        <>
          <button
            className="group flex w-full items-center justify-between space-x-4 outline-none"
            onClick={() => setIsExpanded(c => !c)}
          >
            <h3 className="text-xl font-semibold lg:text-2xl">{title}</h3>
            <ChevronRight
              className={clsx("h-6 w-6 duration-150 group-hover:opacity-50", {
                "rotate-90": isExpanded,
              })}
            />
          </button>
          <Expandable isExpanded={isExpanded} duration={0.3}>
            <div className="pt-8">{children}</div>
          </Expandable>
        </>
      ) : (
        children
      )}
    </div>
  );
};
