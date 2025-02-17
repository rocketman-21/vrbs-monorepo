"use client";

import { isEthAddress, isShortenedEthAddress } from "@cobuild/libs/utils/account";
import { etherscanNetworkUrl } from "@cobuild/libs/utils/url";
import { resolveEnsName } from "@cobuild/libs/web3/ens";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { TextInput } from "@cobuild/ui/atoms/TextInput/TextInput";
import clsx from "classnames";
import { ComponentProps, startTransition, useState } from "react";
import { UserProfileClient } from "../../user-profile/UserProfileClient";
import { GrantsConnectDirect } from "app/[revolutionId]/(website)/grants/[chainId]/[alloProfileId]/components/GrantsConnectDirect";
import { GrantsWithdrawSuperToken } from "app/[revolutionId]/(website)/grants/[chainId]/[alloProfileId]/components/GrantsWithdrawSuperToken";
import { IGrant, Serialized } from "@cobuild/database/types";

interface IProps {
  chainId: number;
  size?: ComponentProps<typeof TextInput>["size"];
  grant: Serialized<IGrant, "isMemberConnectedToPool">;
  initialValue: { address: `0x${string}` | null; amount: number };
  name?: string;
}

export const WithdrawEarnings = (props: IProps) => {
  const { chainId, size, name, grant } = props;
  const [address, setAddress] = useState<`0x${string}` | null>(props.initialValue.address);

  const updateAddress = (address: `0x${string}`) => {
    setAddress(address);
  };

  return (
    <div className="flex flex-row items-start justify-between space-x-2">
      <div className="flex w-full flex-col items-start">
        <TextInput
          value={address || ""}
          type="text"
          size="base"
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
        {address && (
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
                  {name || username}
                </a>
              </div>
            )}
          </UserProfileClient>
        )}
      </div>
      <div className="flex h-full items-center space-x-2 py-1">
        {grant.isMemberConnectedToPool ? (
          <GrantsWithdrawSuperToken className="px-2.5 py-2" withdrawTo={address} grant={grant} />
        ) : (
          <GrantsConnectDirect className="px-2.5 py-2" grant={grant} />
        )}
      </div>
    </div>
  );
};
