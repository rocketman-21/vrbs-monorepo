"use client";

import { getChain } from "@cobuild/libs/web3/utils";
import { protocolRewardsAbi } from "@cobuild/protocol-rewards";
import { Button } from "@cobuild/ui/atoms/Button";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import SvgAddRow from "@cobuild/ui/pixel-icons/AddRow";
import { useContractWrite } from "app/libs/useContractWrite";
import { useRouter } from "next/navigation";
import { Split } from "prisma-database";
import { useAccount } from "wagmi";

interface Props {
  split: Split;
  balance: bigint | undefined;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const zoraRewardsContract = "0x7777777f279eba3d3ad8f4e708545291a6fdba8b";

export function WithdrawZoraRewards({ split, balance, isLoading, refetch }: Props) {
  const { split: splitAddress, chainId } = split;

  const router = useRouter();

  const { write, status } = useContractWrite({
    chainId,
    contract: zoraRewardsContract,
    type: "withdraw",
    successText: "Zora rewards withdrawn!",
    waitingText: "Withdrawing Zora rewards...",
    onSuccess: async () => {
      await refetch();
      router.refresh();
    },
  });

  const { address: account } = useAccount();

  const hasBalance = balance && balance > BigInt(0);

  if (!isLoading && !hasBalance) return null;

  return (
    <Tooltip
      className="flex w-full justify-end"
      title={hasBalance ? "Withdraw Zora Rewards" : "No Zora rewards to withdraw"}
    >
      {!isLoading && hasBalance ? (
        <Button
          fullWidth
          size="md"
          disabled={!hasBalance || status !== "idle"}
          onClick={async () => {
            await write(client => {
              return client.simulateContract({
                account: account,
                address: zoraRewardsContract,
                abi: protocolRewardsAbi,
                chain: getChain(chainId),
                functionName: "withdrawFor",
                args: [
                  splitAddress as `0x${string}`,
                  // 0 to withdraw all
                  0n,
                ],
              });
            });
          }}
        >
          Withdraw from Zora
          <SvgAddRow className="ml-1.5 size-4" />
        </Button>
      ) : (
        <Button fullWidth size="md" color="outline" disabled>
          Withdraw
          <SvgAddRow className="ml-1.5 size-4" />
        </Button>
      )}
    </Tooltip>
  );
}
