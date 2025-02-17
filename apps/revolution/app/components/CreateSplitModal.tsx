"use client";

import { CreatorSplit } from "@cobuild/database/types";
import { useUrlState } from "@cobuild/libs/hooks/useUrlState";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { isEthAddress } from "@cobuild/libs/utils/account";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { etherscanNetworkUrl } from "@cobuild/libs/utils/url";
import { getChain, getNetworkName } from "@cobuild/libs/web3/utils";
import { splitMainAbi } from "@cobuild/splits";
import { Button } from "@cobuild/ui/atoms/Button";
import Expandable from "@cobuild/ui/atoms/Expandable";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { NetworkLogo } from "@cobuild/ui/molecules/NetworkLogo/NetworkLogo";
import { StaticModal } from "@cobuild/ui/molecules/StaticModal/StaticModal";
import { toast } from "@cobuild/ui/organisms/Notifications";
import SuccessIcon from "@cobuild/ui/pixel-icons/Check";
import { SplitAddresses } from "app/components/splits/SplitAddresses";
import { useContractWrite } from "app/libs/useContractWrite";
import { useRevolution } from "app/libs/useRevolution";
import clsx from "classnames";
import { useRouter } from "next/navigation";
import pluralize from "pluralize";
import { PropsWithChildren, useState } from "react";
import { CopyToClipboard } from "./CopyToClipboard";

const formId = `create-split-for`;

export const CreateSplitModal = () => {
  const { name, addresses, chainId } = useRevolution();
  const router = useRouter();
  const [isOpen, setIsOpen] = useUrlState("createSplit");
  const { user, isConnected } = useUser();
  const [splits, setSplits] = useState<CreatorSplit[]>(user ? [{ address: user, bps: 1e4 }] : []);
  const [hasError, setHasError] = useState(false);
  const [pointsPercent, setPointsPercent] = useState(10);
  const [step, setStep] = useState(0);
  const [split, setSplit] = useState<`0x${string}` | null>(null);

  const closeModal = () => {
    setStep(0);
    setPointsPercent(10);
    setSplits(user ? [{ address: user, bps: 1e4 }] : []);
    setSplit(null);
    setIsOpen("");
  };

  const { write, status } = useContractWrite({
    chainId,
    contract: addresses?.splitsCreator as `0x${string}`,
    type: "createSplit",
    trackerType: "revolution_split",
    successText: "Split created!",
    waitingText: "Saving onchain...",
    onSuccess: async (hash, split) => {
      setSplit(split as any);
      router.refresh();
    },
  });

  if (!addresses) return null;
  const { executor, splitsCreator } = addresses;

  if (!executor || !splitsCreator) return null;

  const isSuccess = split && isEthAddress(split);

  const saveTransaction = async () => {
    try {
      if (hasError) throw new Error("Please fix errors first");

      if (status !== "idle") return;

      if (!user) throw new Error("Please login");
      if (!isConnected) throw new Error("Please connect wallet");

      const sortedSplits = splits.sort((a, b) => {
        return a.address.localeCompare(b.address);
      });

      await write(client => {
        return client.simulateContract({
          account: user,
          address: splitsCreator,
          abi: splitMainAbi,
          chain: getChain(chainId),
          functionName: "createSplit",
          args: [
            {
              //PERCENTAGE_SCALE is 1e6
              pointsPercent: 1e6 * (pointsPercent / 100),
              accounts: sortedSplits.map(s => s.address as `0x${string}`),
              //PERCENTAGE_SCALE is 1e6
              percentAllocations: sortedSplits.map(s => s.bps * 1e2),
            },
            sortedSplits.map(s => s.address as `0x${string}`),
            //PERCENTAGE_SCALE is 1e6
            sortedSplits.map(s => s.bps * 1e2),
            0,
            user,
          ],
        });
      });
    } catch (e: any) {
      console.error(e);
      toast.error(getErrorMessage(e) || "Couldn't create split. Try again");
    }
  };

  return (
    <StaticModal
      isOpen={isOpen === "true"}
      closeModal={closeModal}
      title="Create split"
      width="670px"
      showCloseButton
      actions={
        !isSuccess && (
          <>
            {step > 0 && (
              <Button
                size="md"
                type="button"
                color="transparent"
                onClick={() => setStep(step - 1)}
                disabled={status !== "idle"}
              >
                Go back
              </Button>
            )}
            {step < 2 && (
              <Button size="md" type="button" color="primary" onClick={() => setStep(step + 1)}>
                Next step
              </Button>
            )}
            {step === 2 && (
              <Button
                size="md"
                disabled={status !== "idle" || hasError || splits.length === 0}
                type="submit"
                form={formId}
                pulse={status !== "idle"}
              >
                {status !== "idle" ? "Please wait... " : "Create Split"}
              </Button>
            )}
          </>
        )
      }
    >
      <div className="flex w-full flex-col">
        {!isSuccess && (
          <>
            <h1 className="mb-1 flex items-center text-xl font-semibold max-sm:hidden dark:text-white">
              Create Split
              <Tooltip
                subtitle={`This split account can only receive funds on the ${getNetworkName(chainId)} network`}
              >
                <span className="ml-4 text-xs font-normal text-zinc-500">
                  <NetworkLogo chainId={chainId} showLabel />
                </span>
              </Tooltip>
            </h1>
            <h3 className="tracking-tighter text-zinc-500">
              Earn votes for all money split with the treasury.
            </h3>
          </>
        )}

        {!isSuccess && (
          <form className="mt-6 space-y-4" id={formId} action={saveTransaction}>
            <Step index={0} label={`Decide percentage for ${name}`} step={step} setStep={setStep}>
              <div className="relative mt-2.5 flex items-center space-x-3">
                <span className="text-sm text-zinc-500">0%</span>
                <input
                  type="range"
                  min={1}
                  max={99}
                  step={1}
                  className="transparent accent-lead-500 h-[6px] w-full cursor-pointer appearance-none rounded-lg border-transparent bg-black/30"
                  onChange={e => setPointsPercent(Number(e.target.value))}
                  value={pointsPercent}
                />
                <span className="text-sm text-zinc-500">100%</span>
              </div>
              <p className="mt-4 text-sm tracking-tight text-zinc-600">
                <strong className="font-medium tabular-nums">{pointsPercent}%</strong> of incoming
                funds will go to{" "}
                <a
                  href={etherscanNetworkUrl(executor, chainId, "address")}
                  target="_blank"
                  className="text-lead-500 hover:underline"
                >
                  {name}
                </a>{" "}
                to earn you votes.
              </p>
            </Step>

            <Step index={1} label="Add recipient(s)" step={step} setStep={setStep}>
              <h3 className="text-sm tracking-tight text-zinc-500">
                Where should remaining funds go?
              </h3>
              <div className="mt-2.5 flex flex-col space-y-4">
                <SplitAddresses
                  initialValue={[{ address: user || "", bps: 1e4 }]}
                  onChange={setSplits}
                  onError={setHasError}
                  label="Recipient"
                  min={1}
                  max={100}
                  chainId={chainId}
                  size="base"
                />
              </div>
            </Step>

            <Step index={2} label="Review & confirm" step={step} setStep={setStep}>
              <p className="text-sm leading-normal tracking-tight text-zinc-600">
                You are about to create a new split address. <b>{pointsPercent}%</b> of the incoming
                funds will be allocated to the {name} Treasury, while the remaining{" "}
                <b>{100 - pointsPercent}%</b> will be distributed among the{" "}
                <b>
                  {splits.length} {pluralize("recipient", splits.length)}
                </b>{" "}
                you have specified.
              </p>
            </Step>
          </form>
        )}

        {isSuccess && (
          <div className="flex flex-col items-center py-12">
            <div className="flex size-9 items-center rounded-full bg-green-500 p-1.5 text-white">
              <SuccessIcon className="size-full" />
            </div>
            <h3 className="mt-1.5 text-xl font-medium tracking-tight">Split created!</h3>
            <p className="mt-4 text-balance text-center text-sm text-zinc-500">
              Any incoming funds sent to the following address will be automatically split:{" "}
              <b>{pointsPercent}%</b> to {name} and <b>{100 - pointsPercent}%</b> to {splits.length}{" "}
              {pluralize("recipient", splits.length)}. It works only on{" "}
              <NetworkLogo chainId={chainId} showLabel className="align-bottom font-medium" />
            </p>
            <div className="mt-4">
              <a
                target="_blank"
                className="hover:text-lead-500 font-medium text-zinc-900 duration-100 ease-in-out"
                href={etherscanNetworkUrl(split, chainId, "address")}
              >
                {split}
              </a>
            </div>
            <div className="mt-6">
              <CopyToClipboard text={split}>
                <Button size="md">Copy to clipboard</Button>
              </CopyToClipboard>
            </div>
          </div>
        )}
      </div>
    </StaticModal>
  );
};

const Step = (
  props: PropsWithChildren<{
    index: number;
    step: number;
    setStep: (step: number) => void;
    label: string;
  }>,
) => {
  const { index, step, setStep, label, children } = props;

  const isExpanded = step === index;

  return (
    <div className="flex items-start rounded-xl border border-zinc-300 p-2.5">
      <div
        className={clsx(
          "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-black duration-100 ease-in-out",
          {
            "bg-secondary-200 text-secondary-950": isExpanded,
            "bg-zinc-200 text-zinc-950": !isExpanded,
          },
        )}
      >
        {index + 1}
      </div>
      <div className="grow px-4">
        <h3 className="text-base font-medium leading-8 tracking-tight">
          <button
            type="button"
            onClick={() => setStep(index)}
            className="duration-100 ease-out hover:opacity-70"
          >
            {label}
          </button>
        </h3>
        <Expandable isExpanded={isExpanded} className={isExpanded ? "pb-1.5" : undefined}>
          {children}
        </Expandable>
      </div>
    </div>
  );
};
