"use client";

import { BASE_USDC_ADDRESS } from "@cobuild/database/models/revolution/revolutions/addresses";
import { IGrant, Serialized } from "@cobuild/database/types";
import { Dropdown } from "@cobuild/ui/atoms/Dropdown";
import { Ether } from "@cobuild/ui/atoms/Ether";
import Skeleton from "@cobuild/ui/atoms/Skeleton";
import SvgChevronDown from "@cobuild/ui/pixel-icons/ChevronDown";
import Image from "next/image";
import { useState } from "react";
import { useAccount, useBalance } from "wagmi";

export type DonationToken = "eth" | "usdc";

interface Props {
  onChange: (token: DonationToken) => void;
  grant: Serialized<IGrant>;
}

export const DonationCurrencySelect = (props: Props) => {
  const { onChange, grant } = props;

  const [selectedToken, setSelectedToken] = useState<DonationToken>("eth");

  const selectChain = (token: DonationToken) => {
    setSelectedToken(token);
    onChange(token);
  };

  const tokens: DonationToken[] = ["eth", "usdc"];

  return (
    <Dropdown
      button={
        <button type="button" className="group/chain flex shrink-0 items-center pr-4 outline-none">
          <TokenLogo token={selectedToken} />
          <span className="ml-1.5 hidden whitespace-nowrap text-sm uppercase">{selectedToken}</span>
          <SvgChevronDown className="ml-2 size-4 shrink-0 text-zinc-400 duration-150 group-hover/chain:text-black dark:group-hover/chain:text-white" />
        </button>
      }
    >
      {tokens.map(token => (
        <Dropdown.Item key={token} onClick={() => selectChain(token)}>
          <ChainItem chainId={grant.chainId} token={token} />
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
};

const ChainItem = (props: { token: DonationToken; chainId: number }) => {
  const { token, chainId } = props;
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading } = useBalance({
    address,
    ...(token === "usdc" ? { token: BASE_USDC_ADDRESS } : {}),
    chainId,
    query: { staleTime: 10_000, enabled: isConnected },
  });

  return (
    <div className="flex min-w-[220px] items-center space-x-2.5">
      <TokenLogo token={token} />
      <dl>
        <dt className="text-sm uppercase">{token}</dt>
        {isConnected && (
          <dd className="flex items-center text-xs text-zinc-500">
            <span className="mr-1">Balance:</span>
            {!isLoading && balance && (
              <Ether
                amount={token === "usdc" ? balance.value * BigInt(1e12) : balance.value}
                symbol={balance.symbol as "ETH"}
              />
            )}
            {isLoading && <Skeleton height={12} width={48} rounded />}
          </dd>
        )}
      </dl>
    </div>
  );
};

const TokenLogo = (props: { token: DonationToken }) => {
  const { token } = props;

  let img;
  switch (token) {
    case "usdc":
      img = "/images/utility-img/usdc-logo.png";
      break;
    case "eth":
    default:
      img = "/images/utility-img/network-logos/ethereum.svg";
      break;
  }

  return <Image src={img} width="24" height="24" className="size-5 lg:size-6" alt={token} />;
};
