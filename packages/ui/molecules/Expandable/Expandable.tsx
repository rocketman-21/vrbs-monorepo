"use client";

import { ReactNode, useState } from "react";
import { Expandable as ExpandableAtom } from "../../atoms/Expandable";
import clsx from "classnames";

interface Props {
  button: ReactNode;
  children: ReactNode;
  duration?: number;
  className?: string;
  initialExpanded?: boolean;
}

export const Expandable = (props: Props) => {
  const { button, initialExpanded = false, ...rest } = props;
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  return (
    <>
      <button
        onClick={() => setIsExpanded(c => !c)}
        className={clsx({ expanded: isExpanded, collapsed: !isExpanded })}
      >
        {button}
      </button>
      <ExpandableAtom {...rest} isExpanded={isExpanded} />
    </>
  );
};

export default Expandable;
