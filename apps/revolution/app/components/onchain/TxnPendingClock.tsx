import { getRevolutionPalette } from "@cobuild/libs/revolution/config";
import { etherscanNetworkUrl } from "@cobuild/libs/utils/url";
import clsx from "classnames";
import ClockLoader from "react-spinners/ClockLoader";

interface IProps {
  revolutionId: string;
  transactionId?: `0x${string}`;
  chainId?: number;
  children?: React.ReactNode;
}

export const TxnPendingClock = (props: IProps) => {
  const { revolutionId, transactionId, chainId, children } = props;
  const palette = getRevolutionPalette(revolutionId);

  return (
    <div className="mt-12 flex grow flex-col items-center justify-center">
      <ClockLoader color={palette[200]} size="128px" />

      <h3 className="mt-8 text-lg">Transaction in progress...</h3>

      {children}

      {transactionId && chainId && (
        <div className="mt-2.5">
          <a
            href={etherscanNetworkUrl(transactionId, chainId, "tx")}
            className={clsx("text-sm dark:text-zinc-500 dark:hover:text-white", {
              invisible: !transactionId,
            })}
            target="_blank"
            rel="noreferrer"
          >
            View on Explorer
          </a>
        </div>
      )}
    </div>
  );
};
