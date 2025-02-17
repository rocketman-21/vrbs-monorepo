import { variantProps, VariantPropsOf } from "classname-variants/react";
import { forwardRef } from "react";

const buttonProps = variantProps({
  base: "group inline-flex font-medium items-center justify-center whitespace-nowrap duration-200 ease-in-out shrink-0 disabled:cursor-not-allowed",
  variants: {
    roundedFull: {
      true: "!rounded-full",
    },
    color: {
      primary: "bg-lead-300 hover:bg-lead-200 dark:hover:bg-lead-100 dark:bg-lead-200 text-black",
      outline:
        "border border-lead-500 hover:bg-lead-50 dark:border-lead-100 dark:text-white dark:hover:bg-lead-200 dark:hover:text-black",
      transparent: "text-black hover:text-lead-500 dark:text-white dark:hover:text-lead-200",
    },
    size: {
      sm: "px-2.5 py-1 text-xs rounded-md",
      base: "px-4 py-1.5 text-sm rounded-md",
      md: "px-4 py-2 text-base rounded-md",
      lg: "px-4 md:px-6 py-2 md:py-3 text-base rounded-lg",
    },
    fullWidth: {
      true: "w-full",
    },
    grow: {
      true: "grow",
    },
    pulse: {
      true: "animate-pulse",
    },
  },
  defaultVariants: {
    color: "primary",
    size: "base",
  },
});

type Props = JSX.IntrinsicElements["button"] &
  VariantPropsOf<typeof buttonProps> & {
    as?: React.ElementType<any>;
  };

export const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { as: Component = "button", ...rest } = props;
  return <Component ref={ref} {...buttonProps(rest)} />;
});

Button.displayName = "Button";
