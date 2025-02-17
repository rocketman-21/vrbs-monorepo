import { Switch } from "@headlessui/react";
import clsx from "classnames";
import { useEffect, useState } from "react";

export type Props = {
  isChecked?: boolean;
  children?: string;
  onChange?: (isChecked: boolean) => void;
  className?: string;
  disabled?: boolean;
};

export const Toggle = (props: Props) => {
  const { children, isChecked = false, onChange, className, disabled } = props;
  const [checked, setChecked] = useState(isChecked);

  useEffect(() => setChecked(isChecked), [isChecked]); // Sync if state controlled by parent

  return (
    <Switch.Group>
      <div className={clsx("group flex shrink-0 items-center gap-x-2.5", className)}>
        <Switch
          disabled={disabled}
          checked={checked}
          onChange={newValue => {
            setChecked(newValue);
            if (onChange) onChange(newValue);
          }}
          className={clsx(
            "relative inline-flex h-5 w-[38px] shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 focus:outline-none group-hover:opacity-75",
            {
              "dark:bg-lead-200 bg-lead-300": checked,
              "bg-zinc-200 dark:bg-zinc-600": !checked,
            },
          )}
        >
          <span
            aria-hidden="true"
            className="ui-checked:translate-x-[18px] pointer-events-none inline-block size-4 rounded-full bg-white shadow-lg duration-200"
          />
        </Switch>
        {children && <Switch.Label className="cursor-pointer select-none">{children}</Switch.Label>}
      </div>
    </Switch.Group>
  );
};
