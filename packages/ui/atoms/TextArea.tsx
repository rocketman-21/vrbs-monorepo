"use client";

import clx from "classnames";
import { ChangeEvent, ChangeEventHandler, HTMLProps, useEffect, useRef, useState } from "react";
import { FormElement } from "./FormElement";

export interface Props extends Omit<HTMLProps<HTMLTextAreaElement>, "size" | "onSubmit"> {
  autosize?: boolean;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  onSubmit?: (e: HTMLTextAreaElement) => void;
  error?: string;
  name: string;
  label?: string;
  showBorder?: boolean;
  size?: "base" | "md" | "lg" | "sm";
  maxHeight?: number;
  pulse?: boolean;
}

export const TextArea = (props: Props) => {
  const {
    className,
    autosize,
    onChange,
    onSubmit,
    label,
    error,
    name,
    size = "base",
    showBorder = true,
    maxHeight = 480,
    pulse,
    ...rest
  } = props;
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const [minHeight, setMinHeight] = useState<number>();

  const hasError = !!error;

  useEffect(() => {
    if (!autosize) return;
    setMinHeight(ref.current?.clientHeight);
  }, [autosize]);

  // Submit form with CMD/CTRL + Enter
  useEffect(() => {
    const textarea = ref.current;
    if (!onSubmit || !textarea) return;
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.metaKey) {
        onSubmit(textarea);
        textarea.blur();
      }
    };

    textarea.addEventListener("keydown", listener);
    return () => textarea.removeEventListener("keydown", listener);
  }, [onSubmit]);

  const recalculateHeight = () => {
    if (ref.current) {
      ref.current.style.height = "0px";
      ref.current.style.height = `${Math.min(
        Math.max(minHeight || 0, ref?.current?.scrollHeight),
        maxHeight,
      )}px`;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (autosize) recalculateHeight();
    if (onChange) onChange(e);
  };

  useEffect(() => {
    if (!minHeight) return; // Skip initial set
    if (autosize) recalculateHeight();
  }, [props.value, autosize, minHeight]);

  if (!ref) return null;

  return (
    <div className={className}>
      <FormElement.Fieldset hasError={hasError} showBorder={showBorder}>
        <textarea
          name={name}
          ref={ref}
          className={clx(
            "hide-scrollbar peer w-full resize-none border-0 bg-transparent placeholder-zinc-400 outline-none duration-150 placeholder:font-normal focus:outline-none disabled:opacity-25",
            {
              "py-2.5 text-sm": size === "base",
              "py-2.5 text-sm lg:py-3.5 lg:text-base": size === "lg",
              "py-1.5 text-sm lg:py-2 lg:text-base": size === "md",
              "text-sm": size === "sm",
              "animate-pulse cursor-wait": pulse,
            },
          )}
          onChange={e => handleChange(e)}
          aria-invalid={hasError}
          aria-describedby={error ? `${name}-error` : undefined}
          placeholder="Write something here"
          {...rest}
        />
        {label && <FormElement.Label hasError={hasError}>{label}</FormElement.Label>}
      </FormElement.Fieldset>

      {error && <FormElement.Error name={name}>{error}</FormElement.Error>}
    </div>
  );
};

export default TextArea;
