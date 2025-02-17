"use client";

import { motion } from "framer-motion";
import {
  Children,
  cloneElement,
  FunctionComponent,
  PropsWithChildren,
  SVGProps,
  useState,
} from "react";
import Close from "../../pixel-icons/Close";
import { ActionButtonOption } from "./ActionButtonOption";

type Props = PropsWithChildren<{
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  className?: string;
}>;
type Component = FunctionComponent<Props> & { Option: typeof ActionButtonOption };

export const ActionButton: Component = (props: Props) => {
  const { children: options, icon: Icon, className = "" } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <motion.div
        variants={{
          expanded: { height: "auto", opacity: 1, scale: 1, y: "-10px" },
          collapsed: { height: 0, opacity: 0, scale: 0.5 },
        }}
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        transition={{ duration: 0.4, type: "spring" }}
        className="flex select-none flex-col items-start overflow-hidden outline-none"
      >
        {Children.map(
          options,
          (option: any) => option && cloneElement(option, { collapse: () => setIsExpanded(false) })
        )}
      </motion.div>
      <motion.button
        onClick={() => setIsExpanded(c => !c)}
        className={`${className} flex items-center justify-center rounded-full p-2`}
        variants={{
          expanded: { rotate: 90 },
          collapsed: { rotate: 0 },
        }}
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
      >
        {!isExpanded && <Icon className="h-6 w-6" />}
        {isExpanded && <Close className="h-6 w-6" />}
      </motion.button>
    </>
  );
};

ActionButton.Option = ActionButtonOption;

export default ActionButton;
