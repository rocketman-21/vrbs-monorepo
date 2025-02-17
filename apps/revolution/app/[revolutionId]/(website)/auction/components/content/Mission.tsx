import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { abbreviateNumber, formatPrice } from "@cobuild/libs/utils/numbers";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { useRevolution } from "app/libs/useRevolution";
import Image from "next/image";
import pluralize from "pluralize";

interface Props {
  revolutionId: string;
  className?: string;
  purpose: string;
  stats: {
    treasury: number;
  };
}

export const Mission = async (props: Props) => {
  const { className = "", stats, purpose, revolutionId } = props;
  const config = getRevolutionConfig(props.revolutionId);

  const [memberCounts, raised] = await Promise.all([
    Revolutions().getTotalMembers(revolutionId),
    Revolutions().getMoneyRaised(revolutionId),
  ]);

  const { name, missionBackgroundPattern, missionIllustration } = config;

  return (
    <section className={`bg-lead-100 relative overflow-hidden py-12 lg:py-28 ${className}`}>
      {missionBackgroundPattern && (
        <Image
          src={missionBackgroundPattern}
          alt=""
          width="1500"
          height="500"
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover opacity-10"
        />
      )}
      <div className="relative mx-auto grid max-w-screen-2xl grid-cols-1 gap-6 px-4 lg:grid-cols-2 lg:grid-rows-2 lg:gap-12 lg:px-6">
        <div className="border-lead-600 text-lead-700 bg-secondary-100 rounded-2xl border-8 border-double p-5 lg:p-7">
          <h1 className="mb-4 text-2xl font-bold lg:mb-6 lg:text-4xl">Our Purpose</h1>
          <p className="text-pretty text-lg lg:text-2xl lg:leading-9">{purpose}</p>
        </div>
        <div className="row-span-2 rounded-2xl border-8 border-double border-white bg-white">
          <Image
            src={missionIllustration || "/images/thatsnounish/backdrop.jpeg"}
            alt=""
            width="704"
            height="620"
            className="h-full w-full rounded-xl object-cover"
          />
        </div>
        <div className="bg-lead-600 border-secondary-100 flex flex-col justify-between rounded-2xl border-8 border-double p-5 lg:p-7">
          <div>
            <h3 className="text-secondary-100 text-balance text-xl font-bold lg:text-2xl">
              {name} is owned by the people
            </h3>
            <p className="text-secondary-50 mt-4 text-pretty text-base lg:text-lg">
              We raise money together and vote to fund big ideas. Everyone who participates can earn
              a vote. Anyone can request funding to bring their best ideas to life.
            </p>
          </div>
          <div className="text-secondary-50 mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {/* <dl>
              <dt className="text-xl font-medium lg:text-2xl">
                {abbreviateNumber(stats.ideasFunded)}
              </dt>
              <dd className="mt-0.5 max-sm:text-sm">Ideas funded</dd>
            </dl> */}
            <dl>
              <Tooltip
                subtitle={
                  <>
                    Creators: {memberCounts.uniqueCreators}
                    <br />
                    Auction Winners: {memberCounts.auctionWinners}
                    <br />
                    Bidders: {memberCounts.uniqueBidders}
                    <br />
                    Votes Holders: {memberCounts.tokenHolders}
                    <br />
                  </>
                }
              >
                <dt className="text-xl font-medium lg:text-2xl">
                  {abbreviateNumber(memberCounts.total)}
                </dt>
                <dd className="mt-0.5 max-sm:text-sm">
                  {pluralize("Members", memberCounts.total)}
                </dd>
              </Tooltip>
            </dl>
            <dl>
              <Tooltip
                subtitle={
                  <>
                    From Auction: {formatPrice(raised.auction, "eth", true, true)}
                    <br />
                    From Votes: {formatPrice(raised.points, "eth", true, true)}
                  </>
                }
              >
                <dt className="text-xl font-medium lg:text-2xl">
                  {formatPrice(raised.total, "eth", true, true)}
                </dt>
                <dd className="mt-0.5 max-sm:text-sm">Raised</dd>
              </Tooltip>
            </dl>

            <dl>
              <dt className="text-xl font-medium lg:text-2xl">
                {formatPrice(stats.treasury, "eth", true, true)}
              </dt>
              <dd className="mt-0.5 max-sm:text-sm">Treasury</dd>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};
