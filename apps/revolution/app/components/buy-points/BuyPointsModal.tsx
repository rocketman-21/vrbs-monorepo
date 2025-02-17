"use client";

import { useUrlState } from "@cobuild/libs/hooks/useUrlState";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { Button } from "@cobuild/ui/atoms/Button";
import { Ether } from "@cobuild/ui/atoms/Ether";
import { Expandable } from "@cobuild/ui/atoms/Expandable";
import { TextInput } from "@cobuild/ui/atoms/TextInput/TextInput";
import { Toggle } from "@cobuild/ui/atoms/Toggle";
import { StaticModal } from "@cobuild/ui/molecules/StaticModal/StaticModal";
import SvgWallet from "@cobuild/ui/pixel-icons/Wallet";
import { RelayNetworkSelect } from "app/[revolutionId]/(website)/auction/components/RelayNetworkSelect";
import { useRevolution } from "app/libs/useRevolution";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount, useBalance } from "wagmi";
import { useBuyPoints } from "./useBuyPoints";
import { SplitAddresses } from "../splits/SplitAddresses";
import { CreatorSplit } from "@cobuild/database/types";
import { usePointsCost } from "./usePointsCost";
import { Price } from "@cobuild/ui/molecules/Price/Price";

const formId = `buy-points-model`;

interface Props {
  averagePointPrice: number;
}

export const BuyPointsModal = (props: Props) => {
  const { averagePointPrice } = props;
  const { chainId, points, addresses, revolutionId } = useRevolution();
  const [isOpen, setIsOpen] = useUrlState("buyPoints");
  const [amount, setAmount] = useState("");
  const [isGift, setIsGift] = useState(false);
  const [fromChainId, setFromChainId] = useState<number>(chainId);
  const [recipients, setRecipients] = useState<CreatorSplit[]>([{ address: "", bps: 1e4 }]);
  const { address, isConnected } = useAccount();
  const { login } = useUser();
  const router = useRouter();
  const [showPriceWarning, setShowPriceWarning] = useState(false);

  const isModalOpen = isOpen === "true";

  const payRef = useRef(null);

  const closeModal = () => {
    setIsOpen("");
    resetForm();
  };

  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
    chainId: fromChainId,
    query: { staleTime: 5_000, enabled: isModalOpen && isConnected },
  });

  const { cost } = usePointsCost(10 * 10 ** 18); // 10 points

  const gasPrice = parseEther("0.0005");

  const resetForm = () => {
    setIsGift(false);
    setAmount("");
    setRecipients([]);
  };

  const { quote, buyPoints, status, isOnCorrectNetwork } = useBuyPoints({
    chainId,
    fromChainId,
    addresses: isGift
      ? (recipients.map(r => r.address) as `0x${string}`[])
      : [address as `0x${string}`],
    bpsSplits: isGift ? recipients.map(r => BigInt(r.bps)) : [BigInt(10000)],
    amount: parseEther(amount || "0"),
    enabled: isModalOpen && isConnected,
    onSuccess: () => {
      resetForm();
      router.refresh();
    },
  });

  useEffect(() => {
    if (!amount || !quote.points) return;

    const currentPricePerPoint = Number(amount) / quote.points;
    setShowPriceWarning(currentPricePerPoint > 1.25 * averagePointPrice);
    console.debug({ currentPricePerPoint, averagePointPrice });
  }, [amount, averagePointPrice, quote.points]);

  if (!addresses?.pointsEmitter || !points) return null;

  return (
    <StaticModal
      isOpen={isOpen === "true"}
      closeModal={closeModal}
      title={`Buy ${points.name}`}
      width="524px"
      showCloseButton
      initialFocus={payRef}
      actions={
        <>
          {!isConnected && (
            <Button type="button" onClick={() => login()} size="md">
              Connect wallet
            </Button>
          )}
          {isConnected && (
            <Button
              size="md"
              disabled={(quote.points === 0 || status !== "idle") && isOnCorrectNetwork}
              type="submit"
              form={formId}
            >
              {!isConnected
                ? "Connect wallet"
                : isOnCorrectNetwork
                  ? status !== "idle"
                    ? "Please wait..."
                    : "Buy"
                  : "Switch network"}
            </Button>
          )}
        </>
      }
    >
      <div className="flex w-full flex-col">
        <h1 className="mb-1 text-xl font-semibold max-sm:hidden dark:text-white">
          Buy {points.name}
        </h1>
        <h3 className="text-pretty text-sm text-zinc-500">
          Votes are a soulbound ERC20, and can be{" "}
          <a
            rel="noopener noreferrer"
            className="underline hover:no-underline"
            href="https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/utils/Votes.sol"
            target="_blank"
          >
            delegated
          </a>
          . The price is determined by a{" "}
          <a
            href="https://www.paradigm.xyz/2022/08/vrgda"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            VRGDA
          </a>
          .
        </h3>

        {showPriceWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-6 text-pretty rounded-lg bg-yellow-100 px-4 py-2.5 text-sm font-medium leading-relaxed text-yellow-950"
          >
            The price of 1 vote is high relative to the auction. You may want to wait for the price
            to{" "}
            <a
              href="https://www.paradigm.xyz/2022/08/vrgda"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              adjust
            </a>
            .
          </motion.div>
        )}

        <form className="mt-8 space-y-5 rounded-xl" id={formId} action={buyPoints}>
          <div>
            <TextInput
              label="You pay"
              name="amount"
              value={amount}
              onChange={e => setAmount(e.target.value.replace(",", "."))}
              append={<RelayNetworkSelect onChange={setFromChainId} defaultChainId={chainId} />}
              type="number"
              step="0.01"
              max={99999}
              autoComplete="off"
              size="lg"
              error={
                !isBalanceLoading && balance && balance.value < parseEther(amount)
                  ? "Insufficient balance"
                  : undefined
              }
              disabled={status !== "idle" || !isConnected}
              showErrorText={false}
              autoFocus
              ref={payRef}
            />

            {isConnected && (
              <div className="mt-1.5 flex justify-end">
                <button
                  type="button"
                  className="flex items-center text-xs duration-200 hover:opacity-70"
                  onClick={() => setAmount(formatEther((balance?.value || BigInt(0)) - gasPrice))}
                >
                  <SvgWallet className="mr-1 size-3.5 opacity-75" />{" "}
                  <Ether amount={balance?.value} />
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <TextInput
              label="You get"
              name="votes"
              type="number"
              value={quote.isLoading ? "" : quote.points}
              readOnly
              size="lg"
              append={revolutionId === "vrbs" ? "$vrbs" : "votes"}
              disabled={!isConnected}
            />
            {cost && (
              <div className="mt-1.5 w-full text-right text-xs">
                <Price
                  tooltipPrefix="10 $vrbs = "
                  className=""
                  currentCurrency={"eth"}
                  desiredCurrency={"usd"}
                >
                  {parseInt(cost) / 1e18}
                </Price>
              </div>
            )}
          </div>
          <Toggle isChecked={isGift} onChange={setIsGift} className="text-sm text-zinc-500">
            Buy as a gift
          </Toggle>
          <Expandable isExpanded={isGift} className="flex flex-col space-y-3">
            <SplitAddresses
              label="recipient"
              initialValue={recipients}
              onChange={setRecipients}
              chainId={chainId}
              min={1}
              max={100}
            />
          </Expandable>
        </form>
      </div>
    </StaticModal>
  );
};
