import "server-only";

import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { getUser } from "@cobuild/libs/user/server";
import { Countdown } from "app/components/Countdown";
import { notFound } from "next/navigation";
import { AuctionDetailItem } from "./AuctionDetailItem";
import { AuctionPreLaunchCTA } from "./AuctionPreLaunchCTA";
import { AuctionPreLaunchMedia } from "./AuctionPreLaunchMedia";
import { AuctionUnpauseButton } from "./AuctionUnpauseButton";

interface Props {
  revolutionId: string;
}

export const AuctionPreLaunch = async (props: Props) => {
  const { revolutionId } = props;

  const [revolution, user] = await Promise.all([
    Revolutions().getById(revolutionId),
    getUser(revolutionId),
  ]);
  if (!revolution || !revolution.addresses) notFound();

  const { config, addresses, chainId, auction, cultureIndex } = revolution;

  if (!addresses.cultureIndex || !addresses.auction) return null;

  return (
    <div className="relative mx-auto grid max-w-screen-xl gap-8 rounded-2xl border-0 border-zinc-100 px-4 lg:grid-cols-2 lg:items-center lg:px-6">
      <div className="border-lead-600 aspect-square overflow-hidden rounded-xl border-8 border-double p-[3px] shadow">
        <AuctionPreLaunchMedia
          revolutionId={revolutionId}
          placeholder={config.auctionPreLaunchPlaceholderImage}
          cultureIndex={addresses.cultureIndex}
        />
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="border-lead-600 mt-6 inline-flex max-w-full flex-col items-center rounded-2xl border lg:mt-8 lg:min-w-[380px]">
          {config.auctionLaunchTime && (
            <AuctionDetailItem title="Auction starts in">
              <Countdown
                targetTime={new Date(config.auctionLaunchTime).toISOString()}
                className="text-2xl md:text-3xl"
              />
            </AuctionDetailItem>
          )}

          {!!auction && user === auction.owner && (
            <AuctionUnpauseButton auctionContract={addresses.auction} chainId={chainId} />
          )}

          <div className="border-lead-600 flex flex-col items-center space-y-3 border-t p-5">
            <AuctionPreLaunchCTA />
            <p className="text-sm opacity-70">{cultureIndex?.name} is open for submissions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
