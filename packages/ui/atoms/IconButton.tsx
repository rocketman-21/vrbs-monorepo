"use client";

import { ButtonHTMLAttributes, Fragment, forwardRef } from "react";
import { Tooltip } from "./Tooltip/Tooltip";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export const IconButton = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { className = "", title, ...rest } = props;

  const Container = title ? Tooltip : Fragment;

  return (
    <Container {...(title ? { subtitle: title } : {})}>
      <button
        className={`flex-shrink-0 select-none rounded-full p-1 text-zinc-300 hover:text-zinc-400 focus:outline-none dark:text-zinc-50 dark:hover:text-white ${className}`}
        ref={ref}
        {...rest}
      />
    </Container>
  );
});

IconButton.displayName = "IconButton";
