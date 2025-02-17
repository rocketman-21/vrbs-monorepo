import { useUser } from "@cobuild/libs/hooks/useUser";
import { Ether } from "@cobuild/ui/atoms/Ether";
import { NetworkLogo } from "@cobuild/ui/molecules/NetworkLogo/NetworkLogo";
import BridgeIcon from "@cobuild/ui/pixel-icons/ArrowLeftBox";
import SvgWallet from "@cobuild/ui/pixel-icons/Wallet";
import { useDynamicContext, useFunding } from "@dynamic-labs/sdk-react-core";
import { MobileConditionalTooltip } from "app/components/MobileConditionalTooltip";
import { useRevolution } from "app/libs/useRevolution";
import { base, baseSepolia, mainnet } from "viem/chains";
import { useAccount, useBalance, useSwitchChain } from "wagmi";
import { AccessEmbeddedWallet } from "./AccessEmbeddedWallet";
import { BridgeLinkButton } from "./BridgeLinkButton";

interface Props {
  address: `0x${string}`;
  className?: string;
}

export const Balances = (props: Props) => {
  const { address, className = "" } = props;
  const { chainId } = useRevolution();

  return (
    <div className={`grid grid-cols-2 gap-2.5 ${className}`}>
      <Balance chainId={chainId} address={address} isPrimary />
      {chainId !== mainnet.id && <Balance chainId={mainnet.id} address={address} />}
    </div>
  );
};

const Balance = (props: { chainId: number; address: `0x${string}`; isPrimary?: boolean }) => {
  const { chainId, address, isPrimary } = props;

  const { isConnected, connect } = useUser();
  const { user: dynamicUser } = useDynamicContext();
  const { isAuthenticatedWithAWallet } = dynamicUser || { isAuthenticatedWithAWallet: false };
  const { chain: connectedChain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { enabled, openFunding } = useFunding();
  const mainnetBalance = useBalance({ address, chainId: mainnet.id, query: { staleTime: 10_000 } });
  const hasMainnetBalance = mainnetBalance.data?.value !== BigInt(0);

  const { data: balance, refetch } = useBalance({
    address,
    chainId,
    query: { staleTime: 10_000 },
  });

  const showLargeBridgeButton =
    !!isPrimary && balance?.value == BigInt(0) && hasMainnetBalance && chainId !== mainnet.id;

  return (
    <div className="rounded-lg bg-zinc-50 p-2.5 dark:bg-zinc-700/50">
      <div className="text-xs text-zinc-700 dark:text-zinc-200">
        <NetworkLogo chainId={chainId} showLabel size="18" />
      </div>

      {balance && (
        <div className="mt-1 text-3xl font-semibold text-zinc-800 dark:text-zinc-50">
          {showLargeBridgeButton ? (
            <div className="my-2">
              <BridgeLinkButton />
            </div>
          ) : (
            <Ether amount={balance?.value} />
          )}
        </div>
      )}

      <div className="mt-1.5 flex items-center justify-start space-x-1.5">
        {isPrimary && !isAuthenticatedWithAWallet && <AccessEmbeddedWallet />}

        {isPrimary &&
          (chainId === base.id || chainId === baseSepolia.id) &&
          !showLargeBridgeButton && (
            <MobileConditionalTooltip className="flex items-center" subtitle="Bridge to Base">
              <a
                href="https://relay.link/bridge/base/?fromChainId=1"
                className="inline-flex text-xs text-zinc-400 duration-100 hover:text-zinc-900 dark:hover:text-zinc-100"
                target="_blank"
              >
                <BridgeIcon className="size-[18px]" />
              </a>
            </MobileConditionalTooltip>
          )}
        {isPrimary && enabled && (
          <MobileConditionalTooltip className="flex items-center" subtitle="Buy with fiat">
            <button
              type="button"
              className="inline-flex text-xs text-zinc-400 duration-100 hover:text-zinc-900 dark:hover:text-zinc-100"
              onClick={() => {
                if (!isConnected) return connect();

                // Temp: Banxa widget only supports mainnet for now
                if (connectedChain?.id !== mainnet.id && switchChainAsync) {
                  return switchChainAsync({ chainId: mainnet.id });
                }

                openFunding({ token: "ETH", address }).then(() => refetch());
              }}
            >
              <SvgWallet className="size-[18px]" />
            </button>
          </MobileConditionalTooltip>
        )}
      </div>
    </div>
  );
};
