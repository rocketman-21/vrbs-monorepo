"use client";

import { IGrant, Serialized } from "@cobuild/database/types";
import { AnimatedNumber } from "@cobuild/ui/atoms/AnimatedNumber";
import { SidebarStat } from "app/components/SidebarStat";
import { useEffect, useState } from "react";
import { formatEther } from "viem";

interface Props {
  grant: Serialized<IGrant>;
}

export function GrantTotalEarned(props: Props) {
  const { grant } = props;
  const { memberFlowRate, poolBalance } = grant;

  const [totalEarned, setTotalEarned] = useState(BigInt(poolBalance.totalEarned));

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalEarned(prevEarned => prevEarned + BigInt(memberFlowRate) * 2n);
    }, 2000);
    return () => clearInterval(interval);
  }, [memberFlowRate]);

  return (
    <SidebarStat label="Total Earned">
      <AnimatedNumber
        value={Number(formatEther(BigInt(totalEarned)))}
        format={v =>
          Intl.NumberFormat("en", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 5,
            minimumFractionDigits: 5,
          }).format(Number(v))
        }
      />
    </SidebarStat>
  );
}
