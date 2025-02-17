"use client";

import { etherscanNetworkUrl } from "@cobuild/libs/utils/url";
import { alloDirectGrantsSimpleStrategyAbi } from "@cobuild/libs/web3/wagmi";
import { Button } from "@cobuild/ui/atoms/Button";
import { Ether } from "@cobuild/ui/atoms/Ether";
import { TextInput } from "@cobuild/ui/atoms/TextInput/TextInput";
import { NetworkLogo } from "@cobuild/ui/molecules/NetworkLogo/NetworkLogo";
import { VotingPowerIcon } from "app/components/VotingPowerIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { parseEther } from "viem";
import { useReadContract } from "wagmi";
import { useFundAlloPool } from "../hooks/useFundAlloPool";

interface Props {
  address: `0x${string}`;
  chainId: number;
  poolId: number;
  className?: string;
}

export const PoolBalance = (props: Props) => {
  const { address, chainId, className = "" } = props;
  const [toastId, setToastId] = useState("fundAlloPool");
  const router = useRouter();
  const [hasClickedDonate, setHasClickedDonate] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");

  const { fundPool, status } = useFundAlloPool(chainId, toastId);

  const { data: poolAmount, refetch } = useReadContract({
    abi: alloDirectGrantsSimpleStrategyAbi,
    address,
    chainId,
    functionName: "getPoolAmount",
  });

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <Balance poolAmount={poolAmount} chainId={chainId} address={address} isPrimary />

      {!hasClickedDonate && (
        <DonateButton
          onClick={() => {
            setHasClickedDonate(true);
          }}
        />
      )}

      {hasClickedDonate && (
        <>
          <TextInput
            type="number"
            name="title"
            autoFocus
            value={donationAmount}
            onChange={e => setDonationAmount(e.target.value)}
            autoComplete="off"
            placeholder="Donation amount in ETH"
            required
          />
          <DonateButton
            disabled={status !== "idle"}
            onClick={async () => {
              await fundPool(props.poolId, parseEther(donationAmount));

              refetch();
              router.refresh();
            }}
          />
        </>
      )}
    </div>
  );
};

const DonateButton = (props: { onClick: () => void; disabled?: boolean }) => {
  return (
    <Button disabled={props.disabled} onClick={props.onClick} className="flex flex-row space-x-2">
      <VotingPowerIcon className="size-3" />
      <span>Donate</span>
    </Button>
  );
};

const Balance = (props: {
  chainId: number;
  address: `0x${string}`;
  isPrimary?: boolean;
  poolAmount?: bigint;
}) => {
  const { chainId, address, poolAmount } = props;

  return (
    <div className="rounded-lg bg-zinc-50 p-2.5 dark:bg-zinc-700/50">
      <Link
        target="_blank"
        href={etherscanNetworkUrl(address, chainId, "address")}
        className="text-xs text-zinc-700 dark:text-zinc-200"
      >
        <NetworkLogo showLabel label="Balance" chainId={chainId} size="18" />
      </Link>

      <div className="mt-1 text-3xl font-semibold text-zinc-800 dark:text-zinc-50">
        <Ether amount={poolAmount || 0n} symbol="ETH" />
      </div>
    </div>
  );
};
