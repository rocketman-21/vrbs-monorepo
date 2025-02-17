"use client";

import { createRelayClient } from "@cobuild/libs/web3/relay/client";
import { Dropdown } from "@cobuild/ui/atoms/Dropdown";
import { Ether } from "@cobuild/ui/atoms/Ether";
import Skeleton from "@cobuild/ui/atoms/Skeleton";
import SvgChevronDown from "@cobuild/ui/pixel-icons/ChevronDown";
import { RelayChain } from "@reservoir0x/relay-sdk";
import { useRevolution } from "app/libs/useRevolution";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { parseEther } from "viem";
import { mainnet } from "viem/chains";
import { useAccount, useBalance } from "wagmi";

interface Props {
  onChange: (chainId: number) => void;
  defaultChainId: number;
}

export const RelayNetworkSelect = (props: Props) => {
  const { onChange, defaultChainId } = props;

  const { address, isConnected } = useAccount();

  const { chains } = useMemo(() => createRelayClient(defaultChainId), [defaultChainId]);

  const [selectedChain, setSelectedChain] = useState<RelayChain>(
    () => chains.find(({ id }) => id === defaultChainId) || chains[0],
  );

  const { data: balance } = useBalance({
    address,
    chainId: defaultChainId,
    query: { enabled: isConnected && defaultChainId !== mainnet.id },
  });

  const selectChain = (chain: RelayChain) => {
    setSelectedChain(chain);
    onChange(chain.id);
  };

  // Set default chain to mainnet if balance on defaultChain is < 0.01 ETH
  useEffect(() => {
    if (!balance) return;
    if (defaultChainId === mainnet.id) return;
    if (balance.value < parseEther("0.01")) {
      selectChain(chains.find(({ id }) => id === mainnet.id) || chains[0]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance, chains, defaultChainId]);

  return (
    <Dropdown
      button={
        <button type="button" className="group/chain flex shrink-0 items-center pr-4 outline-none">
          <ChainLogo chain={selectedChain} />
          <span className="ml-1.5 hidden whitespace-nowrap text-sm">
            {selectedChain.displayName}
          </span>
          <SvgChevronDown className="ml-2 size-4 shrink-0 text-zinc-400 duration-150 group-hover/chain:text-black dark:group-hover/chain:text-white" />
        </button>
      }
    >
      {chains.map(chain => (
        <Dropdown.Item key={chain.id} onClick={() => selectChain(chain)}>
          <ChainItem chain={chain} />
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
};

const ChainItem = (props: { chain: RelayChain }) => {
  const { chain } = props;
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading } = useBalance({
    address,
    chainId: chain.id,
    query: { staleTime: 10_000, enabled: isConnected },
  });

  return (
    <div className="flex min-w-[220px] items-center space-x-2.5">
      <ChainLogo chain={chain} />
      <dl>
        <dt className="text-sm">{chain.displayName}</dt>
        {isConnected && (
          <dd className="flex items-center text-xs text-zinc-500">
            <span className="mr-1">Balance:</span>
            {!isLoading && balance && (
              <Ether amount={balance.value} symbol={balance.symbol as "ETH"} />
            )}
            {isLoading && <Skeleton height={12} width={48} rounded />}
          </dd>
        )}
      </dl>
    </div>
  );
};

const ChainLogo = (props: { chain: RelayChain }) => {
  const { chain } = props;
  const { config } = useRevolution();

  if (!chain.icon) return null;

  const icon = chain.icon[config.darkMode ? "dark" : "light"];
  if (!icon) return null;

  return <Image src={icon} width="24" height="24" className="size-5 lg:size-6" alt={chain.name} />;
};
