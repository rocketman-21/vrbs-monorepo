import { getFractionDigits } from "@cobuild/libs/utils/numbers";
import { formatEther } from "viem";

interface Props {
  amount: bigint | undefined;
  symbol?: "Ξ" | "ETH";
}

export const Ether = (props: Props) => {
  const { amount, symbol } = props;

  if (amount === undefined) return null;

  return (
    <>
      {symbol === "Ξ" && symbol} {formatEth(amount)} {symbol !== "Ξ" && symbol}
    </>
  );
};

export function formatEth(amount: bigint = BigInt(0)) {
  const number = Number(formatEther(amount));
  const maximumFractionDigits = getFractionDigits(number);

  return Intl.NumberFormat("en", { maximumFractionDigits, minimumFractionDigits: 1 }).format(
    number,
  );
}
