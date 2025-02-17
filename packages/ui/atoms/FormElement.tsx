import classNames from "classnames";
import { PropsWithChildren } from "react";

export const FormElement = () => null;

const Error = (props: PropsWithChildren<{ name: string }>) => {
  const { children, name } = props;
  return (
    <p className="mt-1.5 text-xs text-red-500 dark:text-red-300" id={`${name}-error`}>
      {children}
    </p>
  );
};

const Fieldset = (
  props: PropsWithChildren<{ hasError: boolean; disabled?: boolean; showBorder?: boolean }>,
) => {
  const { children, hasError, showBorder } = props;
  return (
    <fieldset
      className={classNames(
        "relative flex items-center rounded-lg bg-transparent transition-colors duration-150",
        {
          "border px-2 lg:px-4": showBorder,
          "border-zinc-200 focus-within:border-zinc-700 dark:border-zinc-600 dark:focus-within:border-zinc-400":
            !hasError && showBorder,
          "border-red-500 dark:border-red-300": hasError && showBorder,
        },
      )}
    >
      {children}
    </fieldset>
  );
};

const Label = (props: PropsWithChildren<{ hasError?: boolean; className?: string }>) => {
  const { children, hasError, className } = props;
  return (
    <legend
      className={classNames("ml-0 whitespace-nowrap px-px text-[11px] leading-none", className, {
        "text-zinc-700 peer-focus:text-zinc-900 dark:text-zinc-400 dark:peer-focus:text-white":
          !hasError,
        "dark:text-d-pink-300 text-red-500": hasError,
      })}
    >
      {children}
    </legend>
  );
};

FormElement.Error = Error;
FormElement.Fieldset = Fieldset;
FormElement.Label = Label;
