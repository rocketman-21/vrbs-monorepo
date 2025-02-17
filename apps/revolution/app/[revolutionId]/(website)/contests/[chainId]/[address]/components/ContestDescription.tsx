"use client";

import { IContest } from "@cobuild/database/models/revolution/contests/IContest";
import { markdownToPlainText } from "@cobuild/libs/utils/text";
import Expandable from "@cobuild/ui/atoms/Expandable";
import Markdown from "@cobuild/ui/atoms/Markdown";
import SvgArrowDown from "@cobuild/ui/pixel-icons/ArrowDown";
import SvgArrowUp from "@cobuild/ui/pixel-icons/ArrowUp";
import classNames from "classnames";
import { useState } from "react";

interface Props {
  contest: IContest;
  description: string;
}

export const ContestDescription = (props: Props) => {
  const { description } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  const plainTextDescription = markdownToPlainText(description);
  const isLong = plainTextDescription.length > 70;

  return (
    <div>
      {!isExpanded && (
        <p className="mt-1 text-xs lg:mt-1.5 lg:text-base">
          {isLong ? (
            <Markdown>{plainTextDescription.substring(0, 70) + "..."}</Markdown>
          ) : (
            <Markdown>{description}</Markdown>
          )}
        </p>
      )}
      {isLong && (
        <>
          <Expandable isExpanded={isExpanded}>
            <p className="mt-1 text-xs lg:mt-1.5 lg:text-pretty lg:pr-12 lg:text-base">
              <Markdown>{description}</Markdown>
            </p>
          </Expandable>
          <button
            onClick={() => setIsExpanded(c => !c)}
            className={classNames("pt-2", { expanded: isExpanded, collapsed: !isExpanded })}
          >
            <span className="hover:text-lead-600 dark:hover:text-lead-400 font-medium">
              <div className="flex items-center space-x-2">
                {isExpanded ? (
                  <>
                    <span>Read less</span>
                    <SvgArrowUp className="mr-1.5 size-5" />
                  </>
                ) : (
                  <>
                    <span>Read more</span>
                    <SvgArrowDown className="mr-1.5 size-5" />
                  </>
                )}
              </div>
            </span>
          </button>
        </>
      )}
    </div>
  );
};
