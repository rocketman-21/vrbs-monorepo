"use client";

import { useDuration } from "@cobuild/libs/hooks/useDuration";
import { useRouter } from "next/navigation";

interface Props {
  targetTime: string;
  className?: string;
  maxItems?: number;
}

export const Countdown = ({ targetTime, className = "", maxItems = 6 }: Props) => {
  const router = useRouter();
  const { duration, isExpired, isForever } = useDuration(targetTime, () =>
    setTimeout(() => router.refresh(), 100),
  );

  if (isForever) return null;

  const items = [
    { value: duration.years, unit: "yr" },
    { value: duration.months, unit: "mo" },
    { value: duration.days, unit: "d" },
    { value: duration.hours, unit: "h" },
    { value: duration.minutes, unit: "m" },
    { value: duration.seconds || 0, unit: "s" },
  ]
    .filter(i => !!i.value)
    .slice(0, maxItems);

  return (
    <div suppressHydrationWarning className={className}>
      {isExpired && "ended"}

      {!isExpired && items.length > 0 && (
        <>
          {items.map(item => (
            <span key={item.unit} suppressHydrationWarning>
              {item.value}
              {item.unit}{" "}
            </span>
          ))}
        </>
      )}
    </div>
  );
};
