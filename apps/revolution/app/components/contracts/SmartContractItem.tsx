"use client";

import { useIsMobile } from "@cobuild/libs/hooks/useIsScreenSize";
import { getMediumEthAddress } from "@cobuild/libs/utils/account";
import { etherscanNetworkUrl } from "@cobuild/libs/utils/url";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { toast } from "@cobuild/ui/organisms/Notifications";
import SvgExternalLink from "@cobuild/ui/pixel-icons/ExternalLink";
import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function SmartContractItem({
  address,
  chainId,
  title,
  description,
  condensed,
}: {
  address: `0x${string}`;
  chainId: number;
  condensed?: boolean;
  title: string;
  description: string;
}) {
  return (
    <>
      <dl className="md:w-64">
        <dt className="font-medium capitalize text-zinc-900 max-sm:mb-1.5 dark:text-zinc-100">
          {title}
        </dt>
        <dd className="mt-0.5 text-xs text-zinc-500">{description}</dd>
      </dl>
      <div className="flex max-w-full shrink-0 items-center justify-between space-x-2.5 overflow-hidden rounded-lg bg-zinc-100 p-3 max-sm:mt-2.5 md:space-x-12 md:p-4">
        <Tooltip subtitle="Copy to clipboard" className="max-w-full cursor-pointer">
          <CopyToClipboard onCopy={() => toast.success("Copied")} text={address}>
            <div className="truncate text-sm">
              {condensed ? getMediumEthAddress(address) : address}
            </div>
          </CopyToClipboard>
        </Tooltip>

        <Link
          target="_blank"
          className="text-zinc-400 duration-150 hover:text-zinc-700"
          href={etherscanNetworkUrl(address, chainId, "address")}
        >
          <SvgExternalLink className="h-5 w-5" />
        </Link>
      </div>
    </>
  );
}
