"use client";

import { Ether } from "@cobuild/ui/atoms/Ether";
import { useEffect, useState } from "react";
import { useBalance } from "wagmi";

interface Props {
  address: `0x${string}`;
  chainId: number;
  existingEarnings: string;
}

export function SplitEarnings({ address, chainId, existingEarnings }: Props) {
  const [totalEarnings, setTotalEarnings] = useState<bigint>(BigInt(existingEarnings));

  const { data: balance } = useBalance({
    address,
    chainId,
    query: { staleTime: 10_000 },
  });

  useEffect(() => {
    setTotalEarnings((balance?.value || 0n) + BigInt(existingEarnings));
  }, [balance, existingEarnings]);

  return <Ether symbol="ETH" amount={totalEarnings} />;
}
