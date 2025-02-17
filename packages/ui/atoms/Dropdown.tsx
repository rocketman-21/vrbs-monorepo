"use client";

import { Placement, useFloating } from "@floating-ui/react-dom";
import { Menu } from "@headlessui/react";
import classNames from "classnames";
import { Fragment, ReactNode } from "react";
import { createPortal } from "react-dom";

interface Props {
  children: ReactNode | ((props: { isOpen: boolean; close: () => void }) => ReactNode);
  button: ReactNode | ((props: { isOpen: boolean; close: () => void }) => ReactNode);
  placement?: Placement;
  className?: string;
  disabled?: boolean;
}

export const Dropdown = (props: Props) => {
  const { className = "", children, button, placement = "bottom-end", disabled } = props;
  const { refs, floatingStyles } = useFloating<HTMLButtonElement>({
    placement,
  });

  return (
    <Menu as="div" className={className}>
      {({ open, close }) => (
        <>
          <Menu.Button ref={refs.setReference} as={Fragment} disabled={disabled}>
            {typeof button === "function" ? button({ isOpen: open, close }) : button}
          </Menu.Button>

          {open &&
            createPortal(
              <Menu.Items
                static
                as="div"
                ref={refs.setFloating}
                style={floatingStyles}
                className="z-[80] mt-2 min-w-[200px] rounded-lg bg-white p-[5px] shadow-lg dark:bg-zinc-800"
              >
                {typeof children === "function" ? children({ isOpen: open, close }) : children}
              </Menu.Items>,
              document.body,
            )}
        </>
      )}
    </Menu>
  );
};

interface ItemProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: any;
  disabled?: boolean;
}

export const DropdownItem = (props: ItemProps) => {
  const { onClick, icon: Icon, children, disabled } = props;
  return (
    <Menu.Item disabled={disabled}>
      {({ active }: { active: boolean }) => (
        <button
          onClick={onClick}
          className={classNames(
            "flex w-full items-center space-x-2 rounded-lg px-2.5 py-3 text-left text-sm",
            {
              "text-zinc-900 dark:text-zinc-100": !active,
              "bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-white": active,
              "cursor-not-allowed": disabled,
            },
          )}
        >
          {Icon && (
            <Icon
              width="16"
              height="16"
              className={classNames("shrink-0", {
                "text-zinc-400 dark:text-zinc-200": !active,
                "text-zinc-700 dark:text-zinc-100": active,
              })}
            />
          )}
          <span className="items-center md:whitespace-nowrap">{children}</span>
        </button>
      )}
    </Menu.Item>
  );
};

Dropdown.Item = DropdownItem;
