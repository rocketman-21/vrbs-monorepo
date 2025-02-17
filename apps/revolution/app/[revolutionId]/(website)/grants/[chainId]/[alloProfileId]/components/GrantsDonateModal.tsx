"use client";

import { BASE_USDC_ADDRESS } from "@cobuild/database/models/revolution/revolutions/addresses";
import { IGrant, Serialized } from "@cobuild/database/types";
import { deleteCacheResult } from "@cobuild/libs/cache";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { getChain } from "@cobuild/libs/web3/utils";
import { multiCall3Abi, multiCall3Address, usdcAbi } from "@cobuild/libs/web3/wagmi";
import { revolutionPointsEmitterAbi } from "@cobuild/revolution";
import { Button } from "@cobuild/ui/atoms/Button";
import { Ether } from "@cobuild/ui/atoms/Ether";
import { TextInput } from "@cobuild/ui/atoms/TextInput/TextInput";
import { StaticModal } from "@cobuild/ui/molecules/StaticModal/StaticModal";
import { toast } from "@cobuild/ui/organisms/Notifications";
import SvgWallet from "@cobuild/ui/pixel-icons/Wallet";
import { Votes } from "app/components/Votes";
import { usePointsQuote } from "app/components/buy-points/usePointsQuote";
import { useContractWrite } from "app/libs/useContractWrite";
import { useRevolution } from "app/libs/useRevolution";
import clsx from "classnames";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { encodeFunctionData, formatEther, parseEther, zeroAddress } from "viem";
import { base } from "viem/chains";
import { useBalance } from "wagmi";
import { DonationCurrencySelect, DonationToken } from "./GrantDonateCurrencySelect";

const formId = `donate-grant-modal`;

interface Props {
  grant: Serialized<IGrant>;
  isOpen: boolean;
  closeModal: () => void;
}

export const GrantsDonateModal = (props: Props) => {
  const { isOpen, closeModal, grant } = props;
  const { isAuthenticated, isConnected, user, login, connect } = useUser();
  const { chainId, addresses, config } = useRevolution();
  const [amount, setAmount] = useState("");
  const { quote, points, isQuoteLoading } = usePointsQuote(
    amount.length > 0 ? Number(amount) * 0.01 : 0,
  );
  const router = useRouter();
  const [donationToken, setDonationToken] = useState<DonationToken>("eth");

  const { data: ethBalance } = useBalance({
    address: user || undefined,
    chainId: grant.chainId,
    query: { staleTime: 5_000, enabled: isConnected && isOpen },
  });

  const { data: usdcBalance } = useBalance({
    address: user || undefined,
    ...(donationToken === "usdc" ? { token: BASE_USDC_ADDRESS } : {}),
    chainId: grant.chainId,
    query: { staleTime: 5_000, enabled: isConnected && isOpen },
  });

  const readableBalance =
    donationToken === "usdc"
      ? (usdcBalance?.value || BigInt(0)) * BigInt(1e12)
      : ethBalance?.value || BigInt(0);

  const hasSufficientBalance = readableBalance >= parseEther(amount || "0");

  useEffect(() => {
    if (amount.length > 0 || !ethBalance || !ethBalance.value || !addresses) return;

    // Default amount is 1/5 of the balance or 0.5 ETH, whichever is smaller
    const defaultAmount = Math.min(Number(ethBalance.value) / 5, Number(parseEther("0.5")));

    // Convert defaultAmount to the first two significant digits
    const factor = Math.pow(10, Math.floor(Math.log10(defaultAmount)) - 1);
    const roundedValue = Math.round(defaultAmount / factor) * factor;

    setAmount(formatEther(BigInt(Math.floor(roundedValue * 100) / 100)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethBalance]);

  const { write, status } = useContractWrite({
    chainId,
    contract: multiCall3Address[1],
    type: "donateGrant",
    onSuccess: async () => {
      closeModal();
      await deleteCacheResult(`grant-donations-${grant.salaryRecipientAddress}-${chainId}`);

      setTimeout(() => router.refresh(), 500);
    },
  });

  const { write: writeTokenDonation, status: usdcStatus } = useContractWrite({
    chainId: base.id,
    contract: BASE_USDC_ADDRESS,
    type: "donateGrant",
    onSuccess: async () => {
      closeModal();
      await deleteCacheResult(`grant-donations-${grant.salaryRecipientAddress}-${chainId}`);

      setTimeout(() => router.refresh(), 500);
    },
  });

  const pointsEmitter = addresses?.pointsEmitter;

  if (!pointsEmitter || !points) return null;

  const makeDonation = async () => {
    try {
      if (!isAuthenticated || !user) return login();
      if (!isConnected) return connect();
      if (chainId !== grant.chainId) {
        throw new Error("Contest is on different chain than revolution!");
      }

      if (donationToken === "usdc") {
        await writeTokenDonation(client => {
          return client.simulateContract({
            abi: usdcAbi,
            functionName: "transfer",
            address: BASE_USDC_ADDRESS,
            account: user,
            args: [grant.salaryRecipientAddress, parseEther(amount) / BigInt(1e12)],
          });
        });

        return;
      }

      await write(client => {
        if (!amount) throw new Error("Invalid amount");

        const amountFull = parseEther(amount);

        const buyPoints = {
          target: pointsEmitter,
          allowFailure: false,
          value: amountFull / 100n,
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

        const sendEthToGrant = {
          target: grant.salaryRecipientAddress,
          allowFailure: false,
          value: amountFull,
          callData: `0x` as const,
        };

        return client.simulateContract({
          abi: multiCall3Abi,
          chain: getChain(chainId),
          address: multiCall3Address[1],
          functionName: "aggregate3Value",
          args: [[buyPoints, sendEthToGrant]],
          account: user,
          // @ts-ignore Value is required by multicall but somehow TS doesn't know it
          value: amountFull + amountFull / 100n,
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
      title={`Fund ${grant.alloProfile.name}`}
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
          Fund {grant.alloProfile.name}
        </h1>

        <form className="mb-2 mt-6 space-y-4 rounded-xl" id={formId} action={makeDonation}>
          <div>
            <TextInput
              label="Donation amount"
              name="amount"
              value={amount}
              onChange={e => setAmount(e.target.value.replace(",", "."))}
              type="number"
              step="0.01"
              max={99999}
              autoComplete="off"
              append={
                <DonationCurrencySelect
                  grant={grant}
                  onChange={token => {
                    setDonationToken(token);
                  }}
                />
              }
              size="lg"
              autoFocus
              error={!hasSufficientBalance ? "Insufficient balance" : undefined}
            />
            {isConnected && (
              <div className="mt-1.5 flex justify-end">
                <button
                  type="button"
                  className="flex items-center text-xs uppercase duration-200 hover:opacity-70"
                  onClick={() => {
                    if (donationToken === "usdc") {
                      setAmount(formatEther(readableBalance));
                    }

                    if (donationToken === "eth")
                      setAmount(formatEther(readableBalance - parseEther("0.0005")));
                  }}
                >
                  <SvgWallet className="mr-1 size-3.5 opacity-75" />{" "}
                  <Ether symbol={donationToken as any} amount={readableBalance} />
                </button>
              </div>
            )}
          </div>
          {donationToken === "eth" && (
            <div
              className={clsx("flex flex-wrap items-center text-sm text-zinc-500", {
                "animate-pulse": isQuoteLoading,
              })}
            >
              Earn ~<Votes>{quote || 0}</Votes> {config?.votesShortName || "votes"} for this
              donation
            </div>
          )}
        </form>
      </div>
    </StaticModal>
  );
};
