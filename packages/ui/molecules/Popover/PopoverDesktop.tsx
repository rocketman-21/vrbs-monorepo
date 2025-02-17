import { autoPlacement, useFloating } from "@floating-ui/react-dom";
import { Popover as HeadlessPopover } from "@headlessui/react";
import clx from "classnames";
import { motion } from "framer-motion";
import { Fragment } from "react";
import { createPortal } from "react-dom";
import { Props } from "./Popover";

export const PopoverDesktop = (props: Props) => {
  const { children, button, className, placement, disabled, onHover } = props;
  const { refs, floatingStyles, elements, update } = useFloating({
    placement,
    ...(!placement ? { middleware: [autoPlacement()] } : undefined),
  });

  const handleEnter = (isOpen: boolean) => {
    if (!isOpen) (elements.reference as HTMLElement)?.click();
  };

  const handleLeave = (isOpen: boolean) => {
    isOpen && (elements.reference as HTMLElement)?.click();
  };

  return (
    <HeadlessPopover as={Fragment}>
      {({ open, close }) => (
        <div
          onMouseEnter={onHover ? () => handleEnter(open) : undefined}
          onMouseLeave={onHover ? () => handleLeave(open) : undefined}
        >
          <HeadlessPopover.Button
            ref={refs.setReference}
            className="flex outline-none"
            disabled={disabled}
          >
            {typeof button === "function" ? button({ isOpen: open }) : button}
          </HeadlessPopover.Button>

          {open &&
            createPortal(
              <HeadlessPopover.Panel
                static
                ref={refs.setFloating}
                style={floatingStyles}
                className={clx("z-[90] outline-none", className)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  {typeof children === "function"
                    ? children({ isOpen: open, close, updatePosition: update })
                    : children}
                </motion.div>
              </HeadlessPopover.Panel>,
              document.body,
            )}
        </div>
      )}
    </HeadlessPopover>
  );
};
