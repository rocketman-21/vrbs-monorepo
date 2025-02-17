"use client";

import { CreatorSplit } from "@cobuild/database/types";
import {
  isEthAddress,
  isShortenedEthAddress,
  shortenIfEthAddress,
} from "@cobuild/libs/utils/account";
import { etherscanNetworkUrl, zoraProfileUrl } from "@cobuild/libs/utils/url";
import { resolveEnsName } from "@cobuild/libs/web3/ens";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { TextInput } from "@cobuild/ui/atoms/TextInput/TextInput";
import SvgClose from "@cobuild/ui/pixel-icons/Close";
import clsx from "classnames";
import { ComponentProps, startTransition, useState } from "react";
import { UserProfileClient } from "../user-profile/UserProfileClient";
import { useUser } from "@cobuild/libs/hooks/useUser";

interface IProps {
  onChange: (split: CreatorSplit) => void;
  chainId: number;
  canBeEdited?: boolean;
  canBeRemoved?: boolean;
  removeSplit: () => void;
  disabled?: boolean;
  size?: ComponentProps<typeof TextInput>["size"];
  initialValue: CreatorSplit;
  name?: string;
}

export const SplitAddress = (props: IProps) => {
  const {
    chainId,
    disabled = false,
    canBeEdited = true,
    canBeRemoved = true,
    removeSplit,
    onChange,
    size,
    name,
  } = props;
  const [address, setAddress] = useState<string>(props.initialValue.address || "");
  const [percent, setPercent] = useState<number>(props.initialValue.bps / 100 || 0);
  const { user } = useUser();

  const updateAddress = (address: `0x${string}`) => {
    setAddress(address);
    onChange({ address, bps: percent * 100 });
  };

  const updatePercent = (percent: number) => {
    setPercent(percent);
    onChange({ address, bps: percent * 100 });
  };

  return (
    <div className="flex flex-row items-start justify-between space-x-2">
      <div className="flex w-full flex-col items-start">
        <TextInput
          value={address}
          type="text"
          disabled={disabled || !canBeEdited}
          size={size}
          placeholder="Wallet address or ENS..."
          onChange={e => {
            updateAddress(e.target.value as `0x${string}`);
            if (e.target.value.includes(".")) {
              startTransition(() => {
                try {
                  resolveEnsName(e.target.value).then(
                    address => address && updateAddress(address.toLowerCase() as `0x${string}`),
                  );
                } catch (error) {
                  console.error(`Error resolving ENS name for ${e.target.value}`, error);
                }
              });
            }
          }}
          name={"splitAddress"}
          wrapperClassName="w-full"
          autoComplete="off"
        />
        <UserProfileClient address={address as `0x${string}`}>
          {({ username, profilePicture }) => (
            <div
              className={clsx(
                "bg-lead-50 mx-2.5 inline-flex items-center space-x-1.5 rounded-b-md px-1.5 pb-1 pt-1 duration-150 dark:bg-zinc-800",
                { hidden: (!isEthAddress(address) || isShortenedEthAddress(username)) && !name },
              )}
            >
              <Avatar id={address} imageUrl={profilePicture} size={12} />
              <a
                href={etherscanNetworkUrl(address, chainId, "address")}
                className="text-lead-950 dark:text-lead-100 text-[11px] font-normal leading-none antialiased focus:outline-none"
                target="_blank"
              >
                {shortenIfEthAddress(name || username)}
                {address === user && " (you)"}
              </a>
            </div>
          )}
        </UserProfileClient>
      </div>
      <div className="flex items-center space-x-2">
        <TextInput
          value={percent}
          type="number"
          size={size}
          disabled={disabled}
          min={1}
          max={100}
          step={1}
          placeholder="0"
          append={"%"}
          onChange={e => updatePercent(parseFloat(e.target.value))}
          name={`splitPercent_${address}`}
          wrapperClassName="w-[108px]"
          autoComplete="off"
        />
        {removeSplit && (
          <button
            onClick={removeSplit}
            disabled={!canBeRemoved}
            type="button"
            className={clsx("duration-150", { "cursor-not-allowed opacity-25": !canBeRemoved })}
          >
            <SvgClose className="h-4 w-4 text-zinc-500 duration-150 hover:text-black dark:hover:text-white" />
          </button>
        )}
      </div>
    </div>
  );
};
