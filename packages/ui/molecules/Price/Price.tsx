"use client";

import { useCurrency } from "@cobuild/libs/hooks/useCurrency";
import { Currency, formatPrice } from "@cobuild/libs/utils/numbers";
import { Tooltip } from "../../atoms/Tooltip/Tooltip";

type Props = Omit<JSX.IntrinsicElements["span"], "children"> & {
  children: number | string;
  currentCurrency?: Currency;
  format?: boolean;
  desiredCurrency?: Currency;
  tooltipPrefix?: string;
  round?: boolean;
};

export const Price = (props: Props) => {
  const {
    children,
    currentCurrency = "eth",
    format = true,
    desiredCurrency = "usd",
    round,
    tooltipPrefix,
    className = "",
    ...rest
  } = props;

  const { getPrice } = useCurrency();
  const price = Number(children);

  return (
    <Tooltip
      subtitle={`${tooltipPrefix}${formatPrice(price, currentCurrency)}`}
      className={`inline-block ${className}`}
      {...rest}
    >
      <span>
        {price === 0 ? "Free" : getPrice(price, currentCurrency, format, desiredCurrency, round)}
      </span>
    </Tooltip>
  );
};
