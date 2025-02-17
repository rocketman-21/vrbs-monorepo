import classNames from "classnames";
import { ChangeEventHandler, HTMLProps, useEffect, useState } from "react";

interface Props extends Omit<HTMLProps<HTMLInputElement>, "size"> {
  checked?: boolean;
  label?: any;
  name: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string;
  hasError?: boolean;
}

export const Checkbox = (props: Props) => {
  const {
    checked: controlledChecked = false,
    disabled = false,
    label,
    name,
    onChange,
    value,
    hasError = false,
    ...rest
  } = props;

  const [checked, setChecked] = useState(controlledChecked);

  useEffect(() => setChecked(controlledChecked), [controlledChecked]);

  return (
    <label className="group inline-flex max-w-full shrink-0 items-center">
      <span
        className={classNames(
          "inline-flex size-4 shrink-0 items-center justify-center rounded-sm border",
          {
            "border-zinc-200 bg-white focus-within:border-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:focus-within:border-zinc-400":
              !checked && !disabled && !hasError,
            "border-green-500": checked && !disabled,
            "border-red-500": hasError,
          },
        )}
      >
        <svg
          className={checked ? "visible" : "invisible"}
          width="10"
          height="9"
          viewBox="0 0 10 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.61379 8.23057C3.60892 8.22571 3.60102 8.22569 3.59616 8.23056C3.59129 8.23542 3.5834 8.23542 3.57854 8.23056L0.541054 5.19308C0.345792 4.99781 0.345791 4.68123 0.541053 4.48597L1.26662 3.7604C1.46189 3.56514 1.77847 3.56514 1.97373 3.7604L3.60502 5.39169L8.02549 0.971229C8.22075 0.775967 8.53733 0.775967 8.73259 0.971229L9.45816 1.6968C9.65343 1.89206 9.65343 2.20864 9.45816 2.40391L3.63148 8.23059C3.6266 8.23547 3.61867 8.23545 3.61379 8.23057Z"
            fill="currentColor"
          />
        </svg>
      </span>

      <input
        className="hidden"
        type="checkbox"
        name={name}
        checked={checked}
        disabled={disabled}
        value={value}
        aria-invalid={hasError}
        onChange={e => {
          setChecked(e.target.checked);
          if (onChange) onChange(e);
        }}
        {...rest}
      />
      {label && (
        <span
          className={classNames("ml-2.5 inline-block cursor-pointer select-none text-[13px]", {
            "text-zinc-900 dark:text-white": !disabled,
            "text-zinc-300": disabled,
          })}
        >
          {label}
        </span>
      )}
    </label>
  );
};
