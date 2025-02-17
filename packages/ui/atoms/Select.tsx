"use client";

import { Listbox } from "@headlessui/react";
import classNames from "classnames";
import { HTMLProps, useEffect, useState } from "react";
import ChevronDown from "../icons/ChevronDown";
import Tick from "../icons/Tick";
import { FormElement } from "./FormElement";
import { Tag } from "./Tag";

export interface IOption {
  label: string;
  value: string;
}

interface IProps extends Omit<HTMLProps<HTMLSelectElement>, "onChange" | "defaultValue"> {
  onChange?: (selected: IOption | IOption[] | undefined) => void;
  error?: string;
  label?: string;
  options: IOption[];
  defaultValue?: IOption | IOption[];
  name: string;
  disabled?: boolean;
  inputSize?: "base" | "lg";
}

export const Select = (props: IProps) => {
  const {
    label,
    placeholder,
    multiple = false,
    defaultValue,
    onChange,
    options,
    error,
    name,
    inputSize = "base",
    value,
    disabled = false,
  } = props;

  const [selected, setSelected] = useState<IOption | IOption[] | undefined>(defaultValue);
  const hasError = !!error;

  const hasSelected = multiple ? !!selected && (selected as IOption[]).length > 0 : !!selected;

  // Sync UI with value coming potentially from outside (e.g. Formik)
  useEffect(() => {
    if (!value) {
      setSelected(undefined);
    } else if (multiple) {
      setSelected(options?.filter(option => (value as string[]).includes(option.value)));
    } else {
      setSelected(options?.find(option => option.value === value));
    }
  }, [multiple, options, value]);

  return (
    <div className={disabled ? "opacity-50" : ""}>
      <Listbox
        value={selected}
        onChange={v => {
          const newValue = selected === v ? undefined : v;
          setSelected(newValue);
          if (onChange) onChange(newValue);
        }}
        as={FormElement.Fieldset}
        hasError={hasError}
        disabled={disabled || options.length === 0}
        multiple={multiple}
        showBorder={true}
      >
        <Listbox.Button className="flex w-full items-center focus:outline-none">
          <div
            className={classNames("flex-grow text-left", {
              "py-2.5 text-sm leading-[18px]": inputSize === "base",
              "py-4 text-base leading-[24px]": inputSize === "lg",
            })}
          >
            {!hasSelected && (
              <div className="text-zinc-500 dark:text-zinc-400">{placeholder || "Choose"}</div>
            )}
            {hasSelected && !multiple && (
              <div
                className={classNames("flex flex-row items-center", {
                  "space-x-2": inputSize === "base",
                  "space-x-3": inputSize === "lg",
                })}
              >
                <span>{(selected as IOption).label}</span>
              </div>
            )}
            {hasSelected && multiple && (
              <div className="pb-1.5 pt-0.5">
                {(selected as IOption[]).map(option => (
                  <Tag key={option.value} variant="light" size="xs" className="mr-1 mt-0.5">
                    {option.label}
                  </Tag>
                ))}
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            <ChevronDown width="16" height="16" className="text-zinc-500 dark:text-zinc-400" />
          </div>
        </Listbox.Button>

        <Listbox.Options className="scrollbar-thin scrollbar-rounded-lg scrollbar-thumb-zinc-300 scrollbar-track-zinc-100 dark:scrollbar-thumb-zinc-600 dark:scrollbar-track-zinc-900 peer absolute inset-x-0 z-50 mt-2 max-h-[240px] overflow-auto rounded-lg bg-white p-[5px] shadow-xl focus:outline-none dark:bg-zinc-800">
          {options.map(option => {
            return (
              <Listbox.Option disabled={disabled} key={option.value} value={option}>
                {({ active: hovered }) => (
                  <div
                    className={classNames(
                      "flex w-full cursor-pointer items-center rounded-lg px-2.5",
                      {
                        "bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-white": hovered,
                        "text-zinc-900 dark:text-zinc-100": !hovered,
                        "py-2": inputSize === "base",
                        "py-2.5": inputSize === "lg",
                      },
                    )}
                  >
                    <span className="mr-2 h-4 w-4">
                      <Tick width="16" height="16" className="ui-selected:block hidden" />
                    </span>
                    <span
                      className={classNames({
                        "text-sm": inputSize === "base",
                        "text-base": inputSize === "lg",
                      })}
                    >
                      {option.label}
                    </span>
                  </div>
                )}
              </Listbox.Option>
            );
          })}
        </Listbox.Options>
        {label && <FormElement.Label hasError={hasError}>{label}</FormElement.Label>}
      </Listbox>
      {error && <FormElement.Error name={name}>{error}</FormElement.Error>}
    </div>
  );
};
