"use client";

import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";
import { Scrollable } from "../../atoms/Scrollable";
import { DrawerTitle } from "./DrawerTitle";

interface Props {
  children: ReactNode;
  closeDrawer: () => void;
  isOpen: boolean;
  title?: ReactNode;
  width?: string;
  actions?: ReactNode;
}

export const Drawer = (props: Props) => {
  const { title, width = "700px", isOpen, closeDrawer, actions } = props;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={closeDrawer} static className="min-h-fill-available">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 bg-zinc-800 bg-opacity-85 backdrop-blur-[10px] dark:bg-zinc-950 dark:bg-opacity-70"
            aria-hidden="true"
          />

          <Dialog.Panel
            as={motion.div}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-y-0 right-0 z-[60] flex max-w-full flex-col bg-white text-black backdrop-blur-xl dark:bg-zinc-900/95 dark:text-white"
            style={{ width }}
          >
            {title && (
              <DrawerTitle closeDrawer={closeDrawer} actions={actions}>
                {title}
              </DrawerTitle>
            )}

            <Scrollable vertical className="grow">
              {props.children}
            </Scrollable>
          </Dialog.Panel>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
