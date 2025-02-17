/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { ReactNode } from "react";
import { createPortal } from "react-dom";

export interface Props {
  isOpen: boolean;
  close: () => void;
  className?: string;
  children: ReactNode | ((props: { isOpen: boolean; close: () => void }) => ReactNode);
}

export const SlideUp = (props: Props) => {
  const { children, isOpen, close, className = "" } = props;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-20 bg-zinc-500/40 backdrop-blur dark:bg-black/40"
            onClick={() => close()}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-xl bg-white backdrop-blur-xl dark:bg-zinc-800/95"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.2, type: "spring", stiffness: 200, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.8 }}
            onDragEnd={(_: any, info: PanInfo) => {
              if (info.offset.y > 180) close();
            }}
          >
            <button className="my-2 flex w-full select-none justify-center py-2 focus:outline-none">
              <div className="h-[3px] w-[74px] rounded bg-zinc-700 dark:bg-white/50" />
            </button>
            <div className={className}>
              {typeof children === "function" ? children({ isOpen, close }) : children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default SlideUp;
