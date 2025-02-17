"use client";

import { isEthAddress, isShortenedEthAddress } from "@cobuild/libs/utils/account";
import { zoraProfileUrl } from "@cobuild/libs/utils/url";
import { resolveEnsName } from "@cobuild/libs/web3/ens";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { TextInput } from "@cobuild/ui/atoms/TextInput/TextInput";
import clsx from "classnames";
import { ComponentProps, startTransition, useEffect, useState } from "react";
import { UserProfileClient } from "./user-profile/UserProfileClient";

interface IProps {
  name: string;
  chainId: number;
  onChange?: (address: string) => void;
  label?: string;
  initialValue?: string;
  value?: string;
  disabled?: boolean;
  size?: ComponentProps<typeof TextInput>["size"];
}

export const AddressInput = (props: IProps) => {
  const { disabled = false, chainId, onChange, size, name, label, value = "" } = props;
  const [address, setAddress] = useState<string>(props.initialValue || value);
  const [hasError, setHasError] = useState(false);

  const updateAddress = (address: `0x${string}`) => {
    setAddress(address);
    onChange && onChange(address);
    if (isEthAddress(address)) setHasError(false);
  };

  useEffect(() => setAddress(value), [value]); // Sync if state controlled by parent

  return (
    <div className="flex w-full flex-col items-start">
      <TextInput
        label={label}
        value={address}
        type="text"
        disabled={disabled}
        size={size}
        placeholder="Wallet address or ENS..."
        onChange={({ target: { value } }) => {
          updateAddress(value as `0x${string}`);
          if (value.includes(".")) {
            startTransition(() => {
              resolveEnsName(value).then(a => a && updateAddress(a.toLowerCase() as `0x${string}`));
            });
          }
        }}
        onBlur={() => setHasError(!isEthAddress(address) && !address.includes("."))}
        name={name}
        wrapperClassName="w-full"
        autoComplete="off"
        error={hasError ? "Invalid address" : undefined}
      />

      <UserProfileClient address={address as `0x${string}`}>
        {({ username, profilePicture, displayUsername }) => (
          <div
            className={clsx(
              "bg-lead-50 mx-2.5 inline-flex items-center space-x-1.5 rounded-b-md px-1.5 pb-1 pt-1 duration-150 dark:bg-zinc-800",
              { hidden: !isEthAddress(address) || isShortenedEthAddress(username) },
            )}
          >
            <Avatar id={address} imageUrl={profilePicture} size={12} />
            <a
              href={zoraProfileUrl(address as `0x${string}`, chainId)}
              className="text-lead-950 dark:text-lead-100 text-[11px] font-normal leading-none antialiased"
              target="_blank"
            >
              {displayUsername}
            </a>
          </div>
        )}
      </UserProfileClient>
    </div>
  );
};
