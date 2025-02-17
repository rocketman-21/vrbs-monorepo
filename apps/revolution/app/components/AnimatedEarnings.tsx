"use client";

import { AnimatedNumber } from "@cobuild/ui/atoms/AnimatedNumber";
import { useEffect, useState } from "react";
import { formatEther } from "viem";

interface Props {
  earnings: number;
  flowRate: number;
  seconds?: number;
  fractionDigits?: number;
}

export const AnimatedEarnings = (props: Props) => {
  const { seconds = 2, earnings, fractionDigits = 5 } = props;
  const flowRate = BigInt(props.flowRate);
  const [totalEarned, setTotalEarned] = useState(BigInt(earnings));

  useEffect(() => {
    if (earnings === 0) return;
    const interval = setInterval(() => {
      setTotalEarned(prevEarned => prevEarned + flowRate * BigInt(seconds));
    }, seconds * 1000);
    return () => clearInterval(interval);
  }, [flowRate, earnings]);

  return (
    <AnimatedNumber
      value={Number(formatEther(BigInt(totalEarned)))}
      format={v =>
        Intl.NumberFormat("en", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: fractionDigits,
          minimumFractionDigits: fractionDigits,
        }).format(Number(v))
      }
    />
  );
};
