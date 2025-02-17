"use client";

import { GovernanceType } from "@cobuild/database/types";
import { abbreviateNumber, getFractionDigits } from "@cobuild/libs/utils/numbers";
import { useRevolution } from "app/libs/useRevolution";

interface Props {
  children: bigint | string | number;
  type?: GovernanceType | "auto";
}

export const Votes = (props: Props) => {
  const { children, type = "revolution" } = props;
  const { governanceType } = useRevolution();

  return <>{formatVotes(children, type === "auto" ? governanceType : type)}</>;
};

export function formatVotes(value: bigint | string | number, type: GovernanceType): string {
  const power = type === "revolution" ? Number(value) / 10 ** 18 : Number(value);

  if (power > 1000) return abbreviateNumber(power);

  const maximumFractionDigits = getFractionDigits(power);
  return new Intl.NumberFormat("en", { maximumFractionDigits }).format(power);
}
