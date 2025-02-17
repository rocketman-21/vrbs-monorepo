"use client";

import cx from "classnames";
import { motion } from "framer-motion";
import { MouseEventHandler, ReactNode, useEffect, useRef, useState } from "react";
import ChevronDown from "../../pixel-icons/ChevronDown";
import ChevronUp from "../../pixel-icons/ChevronUp";

interface Props {
  isEnabled?: boolean;
  collapsedHeight?: `${string}px` | `${string}vh`;
  children: ReactNode;
  className?: string;
}

export const Collapsable = (props: Props) => {
  const { isEnabled = true, children, collapsedHeight: height = "90px", className = "" } = props;
  const [isCollapsed, setIsCollapsed] = useState(isEnabled);
  const [isTooLong, setIsTooLong] = useState(true);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const threshold = height.includes("px")
      ? parseInt(height)
      : (window.innerHeight * parseInt(height)) / 100;
    setIsTooLong((ref?.current?.clientHeight ?? 0) > threshold);
  }, [ref, children, height]);

  if (!isEnabled || !isTooLong) return <>{children}</>;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={"collapsed"}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={{
          collapsed: { height },
          expanded: { height: "auto", paddingBottom: "32px" },
        }}
        transition={{ duration: 0.3, ease: "linear" }}
        className={cx("peer relative overflow-hidden", {
          "gradient-mask-b-30 hover:gradient-mask-b-40 cursor-pointer": isCollapsed,
        })}
        onClick={() => (isCollapsed ? setIsCollapsed(false) : undefined)}
      >
        <div ref={ref} className={cx({ "pointer-events-none": isCollapsed })}>
          {children}
        </div>
      </motion.div>
      <ShowMoreBtn show={isCollapsed} onClick={() => setIsCollapsed(c => !c)} />
    </div>
  );
};

const ShowMoreBtn = ({ show, onClick }: { show: boolean; onClick: MouseEventHandler }) => {
  const Icon = show ? ChevronDown : ChevronUp;

  return (
    <button
      type="button"
      className={cx("absolute left-1/2 z-10 -translate-x-1/2 duration-300", {
        "pointer-events-none bottom-2 peer-hover:translate-y-2": show,
        "-bottom-4 px-8 py-4 hover:opacity-40": !show,
      })}
    >
      <Icon width="24" height="24" onClick={onClick} />
    </button>
  );
};

export default Collapsable;
