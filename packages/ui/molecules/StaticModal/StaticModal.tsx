"use client";

import { Dialog } from "@headlessui/react";
import cx from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { CSSProperties, Fragment, MutableRefObject, ReactNode, useCallback } from "react";
import { Scrollable } from "../../atoms/Scrollable";
import Close from "../../pixel-icons/Close";
import { MobileHeader } from "../Modal/MobileHeader";

export type Props = {
  children: ReactNode;
  className?: string;
  title: string;
  closeModal: () => void;
  isOpen: boolean;
  width?: CSSProperties["width"];
  height?: "auto" | "fill";
  minHeight?: CSSProperties["minHeight"];
  actions?: ReactNode;
  closeOnOverlayClick?: boolean;
  initialFocus?: MutableRefObject<HTMLElement | null> | undefined;
  showCloseButton?: boolean;
  confirmClose?: boolean;
};

export const StaticModal = (props: Props) => {
  const {
    actions,
    title,
    isOpen,
    closeModal,
    children,
    width = "500px",
    height = "auto",
    className,
    initialFocus,
    closeOnOverlayClick = true,
    showCloseButton = false,
    minHeight,
    confirmClose = false,
  } = props;

  const onClose = useCallback(() => {
    if (!confirmClose || window.confirm("Are you sure you want to close this modal?")) {
      closeModal();
    }
  }, [closeModal, confirmClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-[60] overflow-y-auto text-black dark:text-white"
          open={isOpen}
          onClose={onClose}
          static
          initialFocus={initialFocus}
        >
          <div
            className={cx([
              "fixed inset-0 bg-zinc-800 bg-opacity-85 backdrop-blur-[10px] dark:bg-zinc-950 dark:bg-opacity-70",
              !closeOnOverlayClick && "pointer-events-none",
            ])}
            aria-hidden="true"
          />
          <div className="flex min-h-screen items-center justify-center">
            <Dialog.Panel
              className={cx(
                "relative flex h-screen w-full max-w-full flex-col overflow-hidden bg-white duration-700 ease-in-out max-sm:!w-full md:mx-auto md:max-h-[90vh] md:rounded-lg dark:bg-zinc-900",
                className,
                {
                  "md:h-auto": height === "auto",
                  "overflow-hidden": !showCloseButton,
                },
              )}
              style={{ width, minHeight }}
            >
              <Dialog.Title as={Fragment}>
                <MobileHeader title={title} onLeftClick={onClose} />
              </Dialog.Title>
              <Scrollable
                vertical
                className={cx("flex grow flex-col p-3 md:p-7", {
                  "md:pb-3": !!actions,
                })}
              >
                {children}
              </Scrollable>
              <AnimatePresence initial={false} mode="wait">
                {actions && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "linear" }}
                    className="flex shrink-0 justify-end space-x-4 p-3 md:px-7 md:pb-7"
                  >
                    {actions}
                  </motion.div>
                )}
              </AnimatePresence>
              {showCloseButton && (
                <button
                  className="absolute right-3.5 top-4 p-2.5 text-zinc-600 hover:text-black focus:outline-none max-sm:hidden dark:text-zinc-100 dark:hover:text-white"
                  onClick={onClose}
                >
                  <Close className="h-6 w-6" />
                </button>
              )}
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default StaticModal;
