"use client";

import { IContest } from "@cobuild/database/models/revolution/contests/IContest";
import { deleteCacheResult } from "@cobuild/libs/cache";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { getChain } from "@cobuild/libs/web3/utils";
import { multiCall3Abi, multiCall3Address } from "@cobuild/libs/web3/wagmi";
import { revolutionPointsEmitterAbi } from "@cobuild/revolution";
import { Button } from "@cobuild/ui/atoms/Button";
import { TextInput } from "@cobuild/ui/atoms/TextInput/TextInput";
import { StaticModal } from "@cobuild/ui/molecules/StaticModal/StaticModal";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { Votes } from "app/components/Votes";
import { usePointsQuote } from "app/components/buy-points/usePointsQuote";
import { useContractWrite } from "app/libs/useContractWrite";
import { useRevolution } from "app/libs/useRevolution";
import clsx from "classnames";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { encodeFunctionData, formatEther, parseEther, zeroAddress } from "viem";
import { useBalance } from "wagmi";

const formId = `donate-contest-modal`;

interface Props {
  contest: IContest;
  isOpen: boolean;
  closeModal: () => void;
}

export const DonateContestModal = (props: Props) => {
  const { isOpen, closeModal, contest } = props;
  const { isAuthenticated, isConnected, user, login, connect } = useUser();
  const { chainId, addresses, config } = useRevolution();
  const [amount, setAmount] = useState("");
  const { quote, points, isQuoteLoading } = usePointsQuote(
    amount.length > 0 ? Number(amount) * 0.1 : 0,
  );
  const router = useRouter();

  const { cultureIndex } = contest;

  const { data: balance } = useBalance({
    address: user || undefined,
    chainId: contest.chainId,
    query: { staleTime: 5_000, enabled: isConnected && isOpen },
  });

  useEffect(() => {
    if (amount.length > 0 || !balance || !balance.value || !addresses) return;
    // Default amount is half of the balance or 0.5 ETH, whichever is smaller
    const defaultAmount = Math.min(Number(balance.value / 2n), Number(parseEther("0.5")));
    setAmount(formatEther(BigInt(defaultAmount)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance]);

  const { write, status } = useContractWrite({
    chainId,
    contract: multiCall3Address[1],
    type: "donateContest",
    onSuccess: async () => {
      await deleteCacheResult(`contests-balance-${contest.address}-${chainId}`);
      closeModal();
      setTimeout(() => router.refresh(), 500);
    },
  });

  const pointsEmitter = addresses?.pointsEmitter;

  if (!pointsEmitter || !points) return null;

  const makeDonation = async () => {
    try {
      if (!isAuthenticated || !user) return login();
      if (!isConnected) return connect();
      if (chainId !== contest.chainId) {
        throw new Error("Contest is on different chain than revolution!");
      }

      await write(client => {
        if (!amount) throw new Error("Invalid amount");

        const amountFull = parseEther(amount);

        const buyPoints = {
          target: pointsEmitter,
          allowFailure: false,
          value: amountFull / 10n,
          callData: encodeFunctionData({
            abi: revolutionPointsEmitterAbi,
            functionName: "buyToken",
            args: [
              [user],
              [10000n],
              {
                builder: zeroAddress,
                deployer: zeroAddress,
                purchaseReferral: zeroAddress,
              },
            ],
          }),
        };

        const sendEthToContest = {
          target: contest.address,
          allowFailure: false,
          value: (amountFull / 10n) * 9n,
          callData: `0x` as const,
        };

        return client.simulateContract({
          abi: multiCall3Abi,
          chain: getChain(chainId),
          address: multiCall3Address[1],
          functionName: "aggregate3Value",
          args: [[buyPoints, sendEthToContest]],
          account: user,
          // @ts-ignore Value is required by multicall but somehow TS doesn't know it
          value: amountFull,
        });
      });
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Failed to fund contest");
    }
  };

  return (
    <StaticModal
      isOpen={isOpen}
      closeModal={closeModal}
      title={`Fund ${cultureIndex.name}`}
      width="500px"
      showCloseButton
      actions={
        <Button
          size="md"
          type="submit"
          form={formId}
          disabled={status !== "idle"}
          pulse={status !== "idle"}
        >
          Donate
        </Button>
      }
    >
      <div className="flex w-full flex-col">
        <h1 className="text-xl font-semibold max-sm:hidden dark:text-white">
          Fund {cultureIndex.name}
        </h1>

        <form className="mb-2 mt-6 space-y-4 rounded-xl" id={formId} action={makeDonation}>
          <TextInput
            label="Donation amount"
            name="amount"
            value={amount}
            onChange={e => setAmount(e.target.value.replace(",", "."))}
            type="number"
            step="0.01"
            max={99999}
            autoComplete="off"
            append="ETH"
            size="lg"
            autoFocus
            error={
              balance && balance?.value < parseEther(amount) ? "Insufficient balance" : undefined
            }
          />
          <div
            className={clsx("flex flex-wrap items-center text-sm text-zinc-500", {
              "animate-pulse": isQuoteLoading,
            })}
          >
            Earn ~<Votes>{quote || 0}</Votes> {config?.votesShortName || "votes"} for this donation
          </div>
        </form>
      </div>
    </StaticModal>
  );
};
