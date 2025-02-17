import clsx from "classnames";
import { ButtonHTMLAttributes, SVGProps } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive: boolean;
  icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  collapse?: () => void;
  isSecondary?: boolean;
}

export const ActionButtonOption = (props: Props) => {
  const { isActive, icon: Icon, collapse, onClick, isSecondary } = props;

  const isPrimary = !isSecondary;

  return (
    <button
      type="button"
      onClick={event => {
        if (collapse) collapse();
        if (onClick) onClick(event);
      }}
      className={clsx("flex items-center space-x-1.5 rounded-2xl transition-colors duration-150", {
        "bg-lead-300 text-black": isActive && isPrimary,
        "dark:text-lead-300 text-lead-900 bg-lead-100 dark:bg-black": isActive && isSecondary,
        "hover:text-lead-500 bg-white text-zinc-700 dark:bg-black dark:text-zinc-400 dark:hover:text-white":
          !isActive,
        "mb-2.5 px-4 py-1 text-sm": isPrimary,
        "mb-1.5 ml-2.5 px-2.5 py-[3px] text-xs": isSecondary,
      })}
    >
      {Icon && <Icon className="h-4 w-4 opacity-75" />}
      <span className="font-semibold">{props.children}</span>
    </button>
  );
};
