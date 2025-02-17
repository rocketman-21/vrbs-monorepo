"use client";

import { useLocalApi } from "../api/useLocalApi";
import { Currency, formatPrice } from "../utils/numbers";

export function useCurrency() {
  const { data: priceData, isLoading } = useLocalApi(`/crons/eth-rates/get-latest`, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  });

  const convertPrice = (price: number, currentCurrency: Currency, intendedCurrency: Currency) => {
    if (currentCurrency === intendedCurrency) return price;

    if (isLoading || !priceData) {
      return;
    }

    if (currentCurrency === "eth") {
      return price * priceData.eth;
    }

    if (currentCurrency === "usd") {
      return (price * 1) / priceData.eth;
    }

    if (currentCurrency === "matic" && intendedCurrency == "usd") {
      return price * priceData.matic;
    }

    if (currentCurrency === "matic" && intendedCurrency == "eth") {
      //convert matic to eth
      return (price * priceData.matic) / priceData.eth;
    }

    return price;
  };

  const getPrice = (
    price: number,
    currentCurrency: Currency = "eth",
    shouldFormat: boolean = true,
    convertTo: Currency = "usd",
    round = false,
  ) => {
    const convertedPrice = convertPrice(price, currentCurrency, convertTo);
    if (!convertedPrice) return 0;

    if (!shouldFormat) return convertedPrice;

    if (isNaN(convertedPrice)) return "-";

    return formatPrice(convertedPrice, convertTo, false, round);
  };

  return { getPrice };
}
