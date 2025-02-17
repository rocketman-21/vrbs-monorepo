import "server-only";

import { IRevolution } from "@cobuild/database/models/revolution/revolutions/IRevolution";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { formatPrice } from "@cobuild/libs/utils/numbers";
import { getBalanceInEth } from "@cobuild/libs/web3/balance";
import { ConditionalWrapper } from "@cobuild/ui/atoms/ConditionalWrapper";
import { Popover } from "@cobuild/ui/molecules/Popover/Popover";
import SvgChevronsVertical from "@cobuild/ui/pixel-icons/ChevronsVertical";
import Link from "next/link";
import { Suspense } from "react";
import { RevolutionLogoLink } from "../links/header/LogoLink";
import { RevolutionList } from "./RevolutionList";
import { RevolutionSearch } from "./RevolutionSearch";
import { etherscanNetworkUrl } from "@cobuild/libs/utils/url";
import { getLatestEthRates } from "@cobuild/database/models/eth/MarketDataRedis";

interface Props {
  revolution: IRevolution;
}

export const RevolutionSelect = async (props: Props) => {
  const { revolution } = props;
  const { revolutionId, name, config } = revolution;
  const { homepageRedirect = "" } = config;

  const [related, rates] = await Promise.all([
    Revolutions().getRelated(revolution),
    getLatestEthRates(),
  ]);

  const hasRelated = related.length > 0;

  const balanceEth = getBalanceInEth(revolution.treasury || []);

  return (
    <div className="flex items-center">
      <RevolutionLogoLink
        logoUrl={revolution.logo}
        revolutionId={revolutionId}
        className="mr-2.5"
      />
      <Popover
        button={
          <div className="header-overlay:text-white group flex items-center justify-start space-x-1 text-left lg:space-x-3">
            <div className="flex flex-col justify-center">
              <h4 className="line-clamp-1 font-semibold max-lg:text-sm">
                <ConditionalWrapper
                  condition={!hasRelated}
                  wrapper={children => (
                    <Link href={`/${revolutionId}/${homepageRedirect}`} className="hover:underline">
                      {children}
                    </Link>
                  )}
                >
                  {name}
                </ConditionalWrapper>
              </h4>

              {revolution.treasury && (
                <Suspense>
                  <a
                    target="_blank"
                    href={etherscanNetworkUrl(
                      revolution.primaryTreasuryAddress || "0x",
                      revolution.chainId,
                      "token-holdings",
                    )}
                    className="text-xs opacity-80 hover:underline"
                  >
                    <span className="max-sm:hidden">Treasury: </span>
                    {formatPrice(
                      (await balanceEth) * (rates?.eth || 1),
                      rates?.eth ? "usd" : "eth",
                    )}
                  </a>
                </Suspense>
              )}
            </div>

            {hasRelated && (
              <SvgChevronsVertical className="group-hover:text-lead-400 dark:group-hover:text-lead-200 h-5 w-5 shrink-0 lg:h-6 lg:w-6" />
            )}
          </div>
        }
        placement="bottom-start"
        className="mt-4"
        disabled={!hasRelated}
      >
        <div className="flex max-h-[65vh] flex-col space-y-2 rounded-xl bg-white/60 p-2 pt-3 shadow-xl backdrop-blur-md lg:max-h-[75vh] dark:bg-black/80">
          <RevolutionSearch />

          <RevolutionList revolutions={related} />
        </div>
      </Popover>
    </div>
  );
};
