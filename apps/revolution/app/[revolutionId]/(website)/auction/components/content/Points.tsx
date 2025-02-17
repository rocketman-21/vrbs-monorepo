import "server-only";

import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { Button } from "@cobuild/ui/atoms/Button";
import Heart from "@cobuild/ui/pixel-icons/Heart";
import TrendingUp from "@cobuild/ui/pixel-icons/TrendingUp";
import Zap from "@cobuild/ui/pixel-icons/Zap";
import capitalize from "lodash/capitalize";
import Image from "next/image";
import Link from "next/link";
import atxDAO from "./atxdao.png";
import groundsCup from "./grounds-cup.png";
import vrbsDunk from "./vrbs-dunk.png";
import pluralize from "pluralize";

interface Props {
  revolutionId: string;
  className?: string;
}

export const Points = async (props: Props) => {
  const { revolutionId, className = "" } = props;

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution) return null;

  const revolutionName = revolution.name;
  const erc20Name = revolution.points?.name || "votes";
  const votesShortName = pluralize(revolution.config.votesShortName || "votes");

  return (
    <section className={`relative bg-zinc-100 py-16 lg:py-24 ${className}`}>
      {revolutionId === "vrbs" && (
        <Image
          src={vrbsDunk}
          alt=" "
          className="pointer-events-none absolute -left-72 -top-[896px] select-none opacity-[0.12]"
        />
      )}
      {revolutionId === "grounds" && (
        <Image
          src={groundsCup}
          alt=" "
          className="pointer-events-none absolute -top-[96px] select-none opacity-[0.12]"
        />
      )}
      {revolutionId === "atxdao" && (
        <Image
          src={atxDAO}
          alt=" "
          className="pointer-events-none absolute -top-[48px] w-full select-none opacity-[0.12] lg:-top-[120px]"
        />
      )}
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-6">
        <div className="lg:pl-8">
          <h2 className="text-3xl font-bold text-zinc-900 lg:text-6xl">{erc20Name}</h2>
          <h3 className="mt-4 max-w-screen-md text-lg text-zinc-700 lg:text-balance lg:text-xl">
            Earn {votesShortName} for building or spending inside the {revolutionName} ecosystem.
          </h3>
        </div>
        <dl className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:px-8">
          {features(revolutionId, erc20Name, revolutionName, votesShortName).map(feature => (
            <div key={feature.name} className="isolate rounded-2xl bg-white p-4 shadow lg:p-7">
              <dt className="text-2xl font-semibold text-zinc-900">
                <div className="bg-secondary-100 mb-6 flex size-12 items-center justify-center rounded-lg">
                  <feature.icon className="text-lead-500 h-6 w-6" aria-hidden="true" />
                </div>
                {feature.name}
              </dt>
              <dd className="mt-2.5 text-sm text-zinc-500 sm:text-base">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
const features = (
  revolutionId: string,
  erc20Name: string,
  revolutionName: string,
  votesShortName: string,
) => [
  {
    name: `What are ${erc20Name}?`,
    description: (
      <>
        <p>
          {capitalize(votesShortName)} track your contributions to {revolutionName}. Vote on
          proposals, grants, art and more. You can buy {votesShortName} or earn them building. Your{" "}
          {votesShortName} let you shape the future of {revolutionName}.
        </p>
        <div className="flex flex-col sm:flex-row">
          <Link className="order-last sm:order-first" href="?buyPoints=true">
            <Button className="mt-4 w-full sm:mt-8 sm:w-auto" size="lg">
              Buy
            </Button>
          </Link>
          <Link
            className="order-first sm:order-last"
            target="_blank"
            href="https://github.com/collectivexyz/revolution-protocol?tab=readme-ov-file#revolutionpointsemitter"
          >
            <Button color="transparent" className="mt-8 w-full sm:w-auto" size="lg">
              Learn more
            </Button>
          </Link>
        </div>
      </>
    ),
    icon: Zap,
  },
  {
    name: `Earn ${erc20Name}`,
    description: (
      <>
        <p>
          Build on our brand, it&apos;s{" "}
          <a
            className="underline"
            href="https://creativecommons.org/public-domain/cc0/"
            target="_blank"
          >
            CC0
          </a>
          . Sell goods and services, split revenue with our treasury, and earn {votesShortName} for
          yourself and your supporters in the process.
        </p>
        <Link href={`/${revolutionId}/auction/?createSplit=true`}>
          <Button className="mt-8 w-full sm:w-auto" size="lg">
            Create split
          </Button>
        </Link>
      </>
    ),
    icon: TrendingUp,
  },
  {
    name: "Treasury and grants",
    description: (
      <>
        <p>
          Proceeds from all {votesShortName} sales are split with our treasury and grants program.
          Using{" "}
          <a
            className="underline"
            href="https://vitalik.eth.limo/general/2019/12/07/quadratic.html"
            target="_blank"
          >
            quadratic voting
          </a>
          , our most impactful public goods initiatives are funded.
        </p>
        <div className="flex flex-col sm:flex-row">
          <Link className="order-last sm:order-first" href={`/${revolutionId}/grants`}>
            <Button className="mt-4 w-full sm:mt-8 sm:w-auto" size="lg">
              Grants program
            </Button>
          </Link>
          <Link className="order-first sm:order-last" href={`/${revolutionId}/dao`}>
            <Button color="transparent" className="mt-8 w-full sm:w-auto" size="lg">
              Proposals
            </Button>
          </Link>
        </div>
      </>
    ),
    icon: Heart,
  },
];
