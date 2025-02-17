import "server-only";

import { IRevolution } from "@cobuild/database/types";
import { getMediumEthAddress } from "@cobuild/libs/utils/account";
import { etherscanNetworkUrl } from "@cobuild/libs/utils/url";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import Collapsable from "@cobuild/ui/molecules/Collapsable/Collapsable";
import CopyIcon from "@cobuild/ui/pixel-icons/Clipboard";
import SvgExternalLink from "@cobuild/ui/pixel-icons/ExternalLink";
import { CopyToClipboard } from "app/components/CopyToClipboard";
import { UserProfile } from "app/components/user-profile/UserProfile";
import { Split } from "prisma-database";
import { DistributeSplit } from "./DistributeSplit";
import { SplitEarnings } from "./SplitEarnings";
import { SplitName } from "./SplitName";
import { WithdrawZoraRewards } from "./WithdrawZoraRewards";
import { WithdrawSplitFunds } from "./WithdrawSplitFunds";

interface Props {
  index: number;
  split: Split;
  revolution: IRevolution;
  user: `0x${string}` | null;
}

export const SplitCard = async (props: Props) => {
  const { index, revolution, user } = props;
  const { split, chainId, pointsData, accounts, percentAllocations, earned, name, controller } =
    props.split;

  if (!revolution.addresses) return null;

  const { splitsCreator, executor } = revolution.addresses;
  if (!splitsCreator || !executor) return null;

  return (
    <section className="flex flex-col rounded-2xl bg-white p-4 shadow lg:p-7">
      <header className="flex items-center space-x-4">
        <div className="bg-secondary-100 text-lead-500 flex size-12 shrink-0 items-center justify-center rounded-lg text-sm font-medium">
          #{index}
        </div>
        <div className="grow">
          <SplitName name={name} split={split as `0x${string}`} canEdit={user === controller} />
          <div className="mt-0.5 flex items-center space-x-2.5 text-sm text-zinc-500">
            <Tooltip
              title="The split address"
              subtitle="Incoming funds will be distributed to recipients listed below"
              position="bottom"
            >
              <span className="cursor-default">{getMediumEthAddress(split)}</span>
            </Tooltip>

            <CopyToClipboard text={split}>
              <CopyIcon className="size-4 text-zinc-500 duration-100 hover:text-zinc-800" />
            </CopyToClipboard>

            <Tooltip subtitle="View on Block Explorer">
              <a
                target="_blank"
                className="text-zinc-500 duration-100 hover:text-zinc-800"
                href={etherscanNetworkUrl(split, chainId, "address")}
              >
                <SvgExternalLink className="size-4" />
              </a>
            </Tooltip>
          </div>
        </div>
      </header>
      <div className="mt-5 flex grow flex-col divide-y divide-zinc-200">
        <Account
          address={executor}
          name={revolution.name}
          imageUrl={revolution.logo}
          bps={pointsData.pointsPercent}
          url={etherscanNetworkUrl(executor, chainId, "address")}
        />

        <Collapsable collapsedHeight="220px">
          {accounts
            .map((address, index) => ({
              address: address as `0x${string}`,
              bps: ((1e6 - pointsData.pointsPercent) / 1e6) * percentAllocations[index],
            }))
            .map(account => (
              <UserProfile
                key={account.address}
                address={account.address}
                revolutionId={revolution.id}
              >
                {({ displayUsername, profilePicture, username }) => (
                  <Account
                    url={`/${revolution.revolutionId}/users/${username}`}
                    address={account.address}
                    name={displayUsername}
                    imageUrl={profilePicture}
                    bps={account.bps}
                  />
                )}
              </UserProfile>
            ))}
        </Collapsable>
      </div>

      <dl className="my-5">
        <dt className="text-sm font-medium text-zinc-500">Total Earnings</dt>
        <dd className="text-lg font-medium text-zinc-800">
          <SplitEarnings
            address={split as `0x${string}`}
            chainId={chainId}
            existingEarnings={earned || "0"}
          />
        </dd>
      </dl>
      <WithdrawSplitFunds splitsCreator={splitsCreator} split={props.split} />
    </section>
  );
};

const Account = (props: {
  imageUrl: string | null;
  address: `0x${string}`;
  name: string;
  bps: number;
  url: string;
}) => {
  const { imageUrl, address, bps, name, url } = props;

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center">
        <Avatar id={address} imageUrl={imageUrl} size={20} className="mr-1.5" />
        <a
          href={url}
          target="_blank"
          className="hover:text-lead-500 text-sm text-zinc-700 duration-100"
        >
          {name}
        </a>
      </div>
      <div className="shrink-0 text-sm text-zinc-700">{bps / 1e4}%</div>
    </div>
  );
};
