import { etherscanNetworkUrl } from "@cobuild/libs/utils/url";
import clsx from "classnames";

interface Props {
  isAwaitingTransaction: boolean;
  isAwaitingWallet: boolean;
  transactionHash: string | undefined;
  chainId: number;
  isSuccessful: boolean;
}

export const TxnWalletStatus = (props: Props) => {
  const { isAwaitingTransaction, isAwaitingWallet, transactionHash, chainId, isSuccessful } = props;

  return (
    <div
      className={clsx("text-sm duration-100 ease-in-out will-change-auto", {
        "animate-pulse opacity-100": (isAwaitingTransaction || isAwaitingWallet) && !isSuccessful,
        "opacity-0": !isAwaitingTransaction && !isAwaitingWallet && !isSuccessful,
      })}
    >
      {isAwaitingTransaction || isSuccessful ? (
        <a
          href={etherscanNetworkUrl(`${transactionHash}`, chainId)}
          target="_blank"
          rel="noopener"
          className="hover:underline"
        >
          {isSuccessful ? "Transaction successful" : "Awaiting confirmation..."}
        </a>
      ) : (
        "Confirm transaction in wallet"
      )}
    </div>
  );
};
