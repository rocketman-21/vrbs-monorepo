"use client";

import { useRevolutionConfig } from "@cobuild/libs/hooks/useRevolutionConfig";
import { shortenIfEthAddress } from "@cobuild/libs/utils/account";
import { Button } from "@cobuild/ui/atoms/Button";
import { ConditionalWrapper } from "@cobuild/ui/atoms/ConditionalWrapper";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { TxnWalletStatus } from "app/components/onchain/TxnWalletStatus";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useUnpauseAuction } from "./hooks/useUnpauseAuction";
import { revalidateAuction } from "./revalidateAuction";

interface Props {
  auctionContract: `0x${string}`;
  chainId: number;
}

export const AuctionUnpauseButton = (props: Props) => {
  const { auctionContract, chainId } = props;
  const { revolutionId } = useRevolutionConfig();
  const { address } = useAccount();
  const router = useRouter();

  const {
    unpauseAuction,
    isUnpausing,
    isAwaitingTransaction,
    transactionHash,
    isSuccess,
    owner,
    isOwner,
  } = useUnpauseAuction(auctionContract, chainId, async () => {
    await revalidateAuction(revolutionId);
    router.refresh();
    toast.success("Auction unpaused!");
  });

  return (
    <div className="space-y-2.5">
      <ConditionalWrapper
        condition={!isOwner}
        wrapper={children => (
          <Tooltip
            title={
              address
                ? "Only the contract owner can unpause the auction."
                : "Your wallet is not connected"
            }
            subtitle={
              address &&
              `Your address is ${shortenIfEthAddress(address)} and the owner is ${shortenIfEthAddress(owner)}`
            }
          >
            {children}
          </Tooltip>
        )}
      >
        <Button
          onClick={() => unpauseAuction()}
          fullWidth
          size="lg"
          className="lg:max-w-xs"
          disabled={isUnpausing || isAwaitingTransaction || !isOwner}
        >
          Start the first auction
        </Button>
      </ConditionalWrapper>

      <TxnWalletStatus
        isAwaitingTransaction={isAwaitingTransaction}
        isAwaitingWallet={isUnpausing}
        chainId={chainId}
        isSuccessful={isSuccess}
        transactionHash={transactionHash}
      />
    </div>
  );
};
