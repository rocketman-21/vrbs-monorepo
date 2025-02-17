"use client";

import { getChain } from "@cobuild/libs/web3/utils";
import { splitMainAbi } from "@cobuild/splits";
import { Button } from "@cobuild/ui/atoms/Button";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import SvgAddRow from "@cobuild/ui/pixel-icons/AddRow";
import { useContractWrite } from "app/libs/useContractWrite";
import { useRouter } from "next/navigation";
import { Split } from "prisma-database";
import { useAccount } from "wagmi";

interface Props {
  splitsCreator: `0x${string}`;
  split: Split;
  balance: bigint;
  isLoading: boolean;
  refetch: () => Promise<void>;
  tokenAddress: `0x${string}`;
}

export function DistributeSplitUSDC({
  split,
  splitsCreator,
  balance,
  isLoading,
  refetch,
  tokenAddress,
}: Props) {
  const { accounts, pointsData, percentAllocations, distributorFee, controller, chainId } = split;

  const { address: account } = useAccount();

  const router = useRouter();

  const { write, status } = useContractWrite({
    chainId,
    contract: splitsCreator,
    type: "distributeSplit",
    successText: "Split distributed!",
    waitingText: "Distributing split...",
    onSuccess: async () => {
      await refetch();
      router.refresh();
    },
  });

  const hasBalance = balance > BigInt(0);

  return (
    <Tooltip
      className="flex w-full justify-end"
      title={hasBalance ? "Distribute Split" : "Split already distributed"}
    >
      {!isLoading && hasBalance ? (
        <Button
          fullWidth
          size="md"
          disabled={!hasBalance || status !== "idle"}
          onClick={async () => {
            await write(client => {
              return client.simulateContract({
                account,
                address: splitsCreator,
                abi: splitMainAbi,
                chain: getChain(chainId),
                functionName: "distributeERC20",
                args: [
                  split.split as `0x${string}`,
                  tokenAddress,
                  {
                    pointsPercent: pointsData.pointsPercent,
                    accounts: pointsData.accounts as `0x${string}`[],
                    percentAllocations: pointsData.percentAllocations,
                  },
                  accounts as `0x${string}`[],
                  percentAllocations,
                  distributorFee,
                  account as `0x${string}`,
                ],
              });
            });
          }}
        >
          Distribute USDC
          <SvgAddRow className="ml-1.5 size-4" />
        </Button>
      ) : (
        <Button fullWidth size="md" color="outline" disabled>
          Distribute USDC
          <SvgAddRow className="ml-1.5 size-4" />
        </Button>
      )}
    </Tooltip>
  );
}
