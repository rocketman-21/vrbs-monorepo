import classNames from "classnames";
import { ChangeEventHandler, forwardRef, HTMLProps, ReactNode } from "react";
import { FormElement } from "../FormElement";
import styles from "./TextInput.module.css";

export interface TextInputProps extends Omit<HTMLProps<HTMLInputElement>, "size"> {
  name: string;
  error?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  size?: "base" | "lg";
  prepend?: ReactNode;
  append?: ReactNode;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  showErrorText?: boolean;
  wrapperClassName?: string;
  pulse?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  const {
    className,
    error,
    prepend,
    append,
    iconLeft,
    iconRight,
    name,
    type = "text",
    size = "base",
    label,
    showErrorText = true,
    wrapperClassName,
    pulse,
    ...rest
  } = props;
  const hasError = !!error;

  return (
    <div className={wrapperClassName}>
      <FormElement.Fieldset hasError={hasError} showBorder>
        {prepend && (
          <div className="mr-2.5 border-r border-zinc-200 pr-2.5 dark:border-zinc-600">
            {prepend}
          </div>
        )}
        {iconLeft && <div className={`${styles.icon} mr-2.5`}>{iconLeft}</div>}
        <input
          id={name}
          name={name}
          type={type}
          aria-invalid={hasError}
          aria-describedby={error ? `${name}-error` : undefined}
          ref={ref}
          className={classNames(
            "peer w-full grow appearance-none bg-transparent placeholder-zinc-400 transition-[width] duration-150 placeholder:font-normal focus:outline-none disabled:opacity-25",
            className,
            styles[size],
            { "animate-pulse cursor-wait": pulse },
          )}
          {...rest}
        />
        {iconRight && <div className={`${styles.icon} ml-2.5`}>{iconRight}</div>}
        {append && (
          <div className="ml-2.5 border-l border-zinc-200 pl-2.5 dark:border-zinc-600">
            {append}
          </div>
        )}
        {label && <FormElement.Label hasError={hasError}>{label}</FormElement.Label>}
      </FormElement.Fieldset>

      {error && showErrorText && <FormElement.Error name={name}>{error}</FormElement.Error>}
    </div>
  );
});

TextInput.displayName = "TextInput";
