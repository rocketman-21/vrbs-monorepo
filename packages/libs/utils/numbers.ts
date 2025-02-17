export type Currency = "eth" | "usd" | "matic";

const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

export const abbreviateNumber = (num: number) => {
  // eslint-disable-next-line no-bitwise
  const tier = (Math.log10(Math.abs(num)) / 3) | 0;
  if (tier === 0) return num.toString();
  const suffix = SI_SYMBOL[tier];
  const scale = 10 ** (tier * 3);
  const scaled = num / scale;
  return scaled.toFixed(1) + suffix;
};

const defaultTimeMapping = {
  years: "years",
  months: "months",
  month: "month",
  day: "day",
  days: "days",
  hour: "hr",
  hours: "hrs",
  minutes: "min",
  seconds: "sec",
};

export const timeUntil = (rawDate: Date | string | number) => {
  const date = rawDate instanceof Date ? rawDate : new Date(rawDate);
  const now = new Date();

  // get total seconds between the times
  let delta = Math.abs(date.getTime() - now.getTime()) / 1000;

  // calculate (and subtract) whole days
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;

  // calculate (and subtract) whole hours
  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  // calculate (and subtract) whole minutes
  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  // what's left is seconds
  const seconds = delta % 60; // in theory the modulus is not required
  return { days, hours, minutes, seconds: Math.round(seconds) };
};

export const timeSince = (
  rawDate: Date | string | number,
  mapping = defaultTimeMapping,
  withSpacing = true,
) => {
  try {
    const date = rawDate instanceof Date ? rawDate : new Date(rawDate);

    const now = new Date();
    const dif = now.getTime() - date.getTime();
    const seconds = Math.floor(dif / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
      return `${Math.floor(interval)}${withSpacing ? " " : ""}${mapping.years}`;
    }

    interval = seconds / 2592000;

    //handle month
    if (interval < 2 && interval > 1) {
      return `${Math.floor(interval)}${withSpacing ? " " : ""}${mapping.month}`;
    }

    if (interval > 1) {
      return `${Math.floor(interval)}${withSpacing ? " " : ""}${mapping.months}`;
    }

    interval = seconds / 86400;

    if (interval < 2 && interval > 1) {
      return `${Math.floor(interval)}${withSpacing ? " " : ""}${mapping.day}`;
    }

    if (interval > 2) {
      return `${Math.floor(interval)}${withSpacing ? " " : ""}${mapping.days}`;
    }

    interval = seconds / 3600;

    if (interval < 2 && interval > 1) {
      return `${Math.floor(interval)}${withSpacing ? " " : ""}${mapping.hour}`;
    }

    if (interval > 1) {
      return `${Math.floor(interval)}${withSpacing ? " " : ""}${mapping.hours}`;
    }

    interval = seconds / 60;

    if (interval > 1) {
      return `${Math.floor(interval)}${withSpacing ? " " : ""}${mapping.minutes}`;
    }

    return `${Math.floor(interval * 60)}${withSpacing ? " " : ""}${mapping.seconds}`;
  } catch (e: any) {
    console.error(e);
    return "";
  }
};

const NEGATIVE_SEC_REGEXP = /^-[0-9]s$/;

const timeUnitMapping = {
  years: "y",
  months: "mo",
  month: "mo",
  day: "d",
  days: "d",
  hour: "hr",
  hours: "hrs",
  minutes: "m",
  seconds: "s",
};

export function timeSinceShort(date: string | Date | number, justNowLabelThresholdSeconds = 0) {
  const time = timeSince(date, timeUnitMapping, false);

  if (time === "0s" || NEGATIVE_SEC_REGEXP.test(time)) {
    return "just now";
  }

  if (time === "30d") {
    return "1mo";
  }

  if (justNowLabelThresholdSeconds !== 0) {
    const timeCopy = time.slice();
    const timeUnit = timeCopy.replace(/\d/g, "");

    const isInSeconds = timeUnit === "s";
    if (isInSeconds) {
      const isBelowThreshold = parseInt(time, 10) < justNowLabelThresholdSeconds;
      if (isBelowThreshold) {
        return "just now";
      }
    }
  }

  return time;
}

export function getFractionDigits(amount: number) {
  if (amount < 0.001) return 6;
  if (amount < 0.01) return 4;
  if (amount < 0.1) return 3;
  if (amount > 1000) return 0;
  return 2;
}

export const formatPrice = (
  price: number,
  currency?: Currency,
  compact = false,
  round = false,
): string => {
  if (Number.isNaN(price)) return "0";

  const maximumFractionDigits = round ? 0 : getFractionDigits(Math.abs(price));

  const number = compact
    ? Intl.NumberFormat("en", {
        notation: "compact",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price)
    : new Intl.NumberFormat("en", { maximumFractionDigits }).format(price);

  if (currency === "eth") return `Ξ${number}`;
  if (currency === "usd") return `$${number}`;
  if (currency === "matic") return `${number} MATIC`;

  return number;
};

export function ordinal(n: number) {
  var s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
