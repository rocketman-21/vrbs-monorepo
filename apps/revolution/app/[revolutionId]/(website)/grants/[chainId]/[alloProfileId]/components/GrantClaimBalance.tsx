"use client";

import { IGrant, Serialized } from "@cobuild/database/types";
import { AnimatedNumber } from "@cobuild/ui/atoms/AnimatedNumber";
import { SidebarStat } from "app/components/SidebarStat";
import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { GrantsConnectDirect } from "./GrantsConnectDirect";
import { GrantsWithdrawSuperToken } from "./GrantsWithdrawSuperToken";

interface Props {
  grant: Serialized<IGrant, "isMemberConnectedToPool">;
}

export function GrantClaimBalance(props: Props) {
  const { grant } = props;
  const { memberFlowRate, isMemberConnectedToPool, poolBalance } = grant;

  const [balance, setBalance] = useState(BigInt(poolBalance.superTokenBalance));

  useEffect(() => {
    const interval = setInterval(() => {
      setBalance(prevEarned => prevEarned + BigInt(memberFlowRate) * 2n);
    }, 2000);
    return () => clearInterval(interval);
  }, [memberFlowRate]);

  return (
    <SidebarStat
      label="Claimable"
      action={
        isMemberConnectedToPool ? (
          <GrantsWithdrawSuperToken grant={grant} />
        ) : (
          <GrantsConnectDirect grant={grant} />
        )
      }
    >
      <AnimatedNumber
        value={Number(formatEther(BigInt(balance)))}
        format={v =>
          Intl.NumberFormat("en", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 6,
            minimumFractionDigits: 6,
          }).format(Number(v))
        }
      />
    </SidebarStat>
  );
}
