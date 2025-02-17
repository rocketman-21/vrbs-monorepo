"use client";

import SvgSpinner from "@cobuild/ui/icons/Spinner";
import { useFormStatus } from "react-dom";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";

type FormAction = string | ((formData: FormData) => void) | undefined;

export const RemoveMediaFormButton = (props: {
  formAction?: FormAction;
  tooltipTitle?: string;
  onClick?: () => void;
}) => {
  const { formAction, tooltipTitle = "Remove", onClick } = props;
  const { pending } = useFormStatus();

  return (
    <button
      formAction={formAction}
      onClick={onClick}
      type={onClick ? "button" : "submit"}
      className="absolute right-2 top-2 z-10 cursor-pointer rounded-full bg-black bg-opacity-50 p-2"
    >
      {pending ? (
        <SvgSpinner width="16" height="16" className="animate-spin" />
      ) : (
        <div className="flex">
          <Tooltip title={tooltipTitle}>
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Tooltip>
        </div>
      )}
    </button>
  );
};
