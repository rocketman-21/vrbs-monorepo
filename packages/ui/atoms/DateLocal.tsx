"use client";

import { HTMLProps } from "react";

type Props = Omit<HTMLProps<HTMLTimeElement>, "dateTime"> & {
  dateTime: string | Date;
  locale?: Intl.LocalesArgument;
  options?: Intl.DateTimeFormatOptions;
};

export const DateLocal = (props: Props) => {
  const { dateTime, locale = "en", options, ...rest } = props;

  const date = typeof dateTime === "object" ? dateTime : new Date(dateTime);

  return (
    <time dateTime={date.toISOString()} suppressHydrationWarning {...rest}>
      {date.toLocaleString(locale, options)}
    </time>
  );
};
