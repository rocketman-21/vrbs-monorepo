"use client";

import clsx from "classnames";
import { ElementType, FocusEvent, HTMLAttributes, KeyboardEvent, useState } from "react";

type Props = HTMLAttributes<HTMLOrSVGElement> & {
  as?: ElementType;
  editable?: boolean;
  onEdit: (content: string) => void;
  placeholder?: string;
  maxLength?: number;
  submitOnEnter?: boolean;
  pulse?: boolean;
};

export const ContentEditable = (props: Props) => {
  const {
    as: Component = "div",
    editable,
    className,
    children,
    onEdit,
    placeholder = "Click to edit...",
    maxLength,
    submitOnEnter,
    pulse,
    ...rest
  } = props;
  const initialContent = children?.toString();
  const [content, setContent] = useState(initialContent);
  const [hasChanges, setHasChanges] = useState(false);

  // Need to remove these classes in editable state, otherwise space char won't be working
  const hasTextBalance = className?.includes("text-balance");
  const hasTextPretty = className?.includes("text-pretty");

  return (
    <Component
      className={clsx(className?.replace("text-balance", "").replace("text-pretty", ""), {
        "focus:ring-lead-300 dark:focus:ring-lead-100 outline-none focus:rounded-md focus:ring":
          editable,
        "text-balance": hasTextBalance && !editable,
        "text-pretty": hasTextPretty && !editable,
        "pointer-events-none animate-pulse cursor-wait": pulse,
      })}
      contentEditable={editable ? "plaintext-only" : false}
      suppressContentEditableWarning
      onFocus={(e: FocusEvent<HTMLElement, Element>) => {
        const text = e.currentTarget.textContent?.trim() || "";
        if (text === placeholder) e.currentTarget.textContent = "";
      }}
      onBlur={(e: FocusEvent<HTMLElement, Element>) => {
        const text = e.currentTarget.textContent?.trim() || "";
        if (text === placeholder) return;
        if (text.length === 0) e.currentTarget.textContent = placeholder;
        if (hasChanges) {
          onEdit(text);
          setContent(text); // Update the content state to avoid duplication
          setHasChanges(false); // Reset the hasChanges state
        }
      }}
      onKeyDown={(e: KeyboardEvent<HTMLElement>) => {
        if (!hasChanges && e.currentTarget.textContent !== initialContent) setHasChanges(true);

        if (submitOnEnter && e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
          return;
        }

        if (!maxLength) return;
        if (e.key !== "Backspace" && (e.currentTarget.textContent?.length || 0) >= maxLength) {
          e.preventDefault();
        }
      }}
      {...rest}
    >
      {!editable && <>{content}</>}
      {editable && <>{content || placeholder}</>}
    </Component>
  );
};
