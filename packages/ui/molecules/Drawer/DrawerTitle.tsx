import { IconButton } from "../../atoms/IconButton";
import { ReactNode } from "react";
import ChevronLeft from "../../icons/ChevronLeft";
import Close from "../../icons/Close";
import clsx from "classnames";

interface Props {
  children: ReactNode;
  closeDrawer: () => void;
  actions?: ReactNode;
}

export const DrawerTitle = (props: Props) => {
  const { children, closeDrawer, actions } = props;

  const hasTitle = !!children;

  return (
    <div
      className={clsx("flex flex-shrink-0 items-center p-4", {
        "md:absolute md:right-0 md:top-0 md:z-20": !hasTitle,
      })}
    >
      <div className="min-w-[28px] flex-shrink-0 md:hidden">
        <IconButton onClick={closeDrawer}>
          <ChevronLeft width="20" height="20" />
        </IconButton>
      </div>

      <div className="flex-grow px-1 text-center md:text-left">{children}</div>

      <div className="flex min-w-[28px] flex-shrink-0 items-center space-x-4">
        {actions}

        <div className="hidden md:block">
          <IconButton onClick={closeDrawer} title="Close">
            <Close width="16" height="16" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
