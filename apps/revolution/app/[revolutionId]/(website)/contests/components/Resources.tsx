import "server-only";

import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { IRevolution } from "@cobuild/database/types";
import Markdown from "@cobuild/ui/atoms/Markdown";
import Splits from "@cobuild/ui/pixel-icons/AddCol";
import Ethereum from "@cobuild/ui/pixel-icons/Ethereum";
import Heart from "@cobuild/ui/pixel-icons/Heart";
import HumanHandsup from "@cobuild/ui/pixel-icons/HumanHandsup";
import clsx from "classnames";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

const resources = (
  revolution: IRevolution,
): {
  title: string;
  href: string;
  target: string;
  icon: any;
  iconForeground: string;
  iconBackground: string;
  description: ReactNode | string;
}[] => {
  const { name, points, socialLinks, config } = revolution;
  const pointsName = points?.name || "Votes";

  return [
    {
      title: `Brand resources`,
      href: config.brandResources || "https://noggles.wtf/",
      target: "_blank",
      icon: Heart,
      iconForeground: "text-purple-700",
      iconBackground: "bg-purple-50",
      description: (
        <Markdown>
          {`Build on our brand, it&apos;s [CC0](https://creativecommons.org/public-domain/cc0/), no
        rights reserved. Create anything you can imagine without permission. Use our logo to build
        your own ${name} art, apps, products, services, shops, meetups, charities and
        more.`}
        </Markdown>
      ),
    },
    {
      title: "Community",
      href: socialLinks?.discord || socialLinks?.twitter || "https://twitter.com/cobuild",
      target: "_blank",
      icon: HumanHandsup,
      iconForeground: "text-yellow-700",
      iconBackground: "bg-yellow-50",
      description: (
        <Markdown>
          {`Join our community on [Discord](${socialLinks?.discord}) and [Twitter](${socialLinks?.twitter}). Life is short, make connections and have fun. Meet other people, share your projects, and get help from all the legends building the movement.`}
        </Markdown>
      ),
    },
    {
      title: "Onchain contracts",
      href: "?viewContracts=true",
      target: "_self",
      icon: Ethereum,
      iconForeground: "text-teal-700",
      iconBackground: "bg-teal-50",
      description: (
        <Markdown>
          {`Build consumer experiences and protocol integrations on top of the ${name} contracts. [Integrate ${pointsName} into smart contracts](https://github.com/collectivexyz/revolution-protocol/blob/c77eef3e88960e776e45ab53c54dad49011d7ce9/packages/revolution/src/AuctionHouse.sol#L410), apps, and more to earn protocol rewards and votes.`}
        </Markdown>
      ),
    },
    {
      title: "Splits",
      href: "?createSplit=true",
      target: "_self",
      icon: Splits,
      iconForeground: "text-lead-700",
      iconBackground: "bg-lead-50",
      description: (
        <Markdown>
          {`[Split](?createSplit=true) your onchain revenue with the ${name} treasury to earn ${pointsName}. Build things like ${name} goods, collectibles, services, and apps to earn ${pointsName} for yourself and your supporters.`}
        </Markdown>
      ),
    },
  ];
};

export async function Resources({ revolutionId }: { revolutionId: string }) {
  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution) return notFound();

  const largeSymbols = ["▀▄▀", "▚▞"];

  return (
    <section className="bg-zinc-100 px-4 pb-24 pt-16 lg:px-6 dark:bg-zinc-800">
      <div className="mx-auto max-w-screen-2xl">
        <h2 className="text-center text-3xl font-bold text-zinc-900 sm:text-4xl dark:text-zinc-100">
          How to participate
        </h2>
        <p className="mx-auto mt-2.5 max-w-2xl text-center text-base leading-7 text-zinc-600 dark:text-zinc-300">
          Resources to help you get started in the {revolution.name} ecosystem.
        </p>

        <div className="mx-auto mt-16 max-w-7xl divide-y divide-zinc-200 overflow-hidden rounded-lg bg-zinc-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0 dark:bg-zinc-800">
          {resources(revolution).map((resource, key) => (
            <div
              key={resource.title}
              className={clsx(
                "focus-within:ring-lead-500 group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset dark:bg-zinc-700",
                {
                  "rounded-tl-lg rounded-tr-lg sm:rounded-tr-none": key === 0,
                  "sm:rounded-tr-lg": key === 1,
                  "sm:rounded-bl-lg": key === resources.length - 2,
                  "rounded-bl-lg rounded-br-lg sm:rounded-bl-none": key === resources.length - 1,
                },
              )}
            >
              <Link
                href={resource.href}
                className="w-full focus:outline-none"
                target={resource.target}
              >
                <span
                  className={clsx(
                    resource.iconBackground,
                    resource.iconForeground,
                    "inline-flex rounded-lg p-3 ring-4 ring-white dark:ring-zinc-600",
                  )}
                >
                  <resource.icon className="h-6 w-6" aria-hidden="true" />
                </span>

                <h3 className="mt-8 text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
                  <div className="flex flex-row items-center space-x-2">
                    <span>{resource.title}</span>
                    {resource.title === "Brand resources" && (
                      <span
                        className={clsx({
                          "text-[10px]": largeSymbols.includes(revolution.symbol),
                          "text-sm": !largeSymbols.includes(revolution.symbol),
                        })}
                      >
                        {revolution.symbol}
                      </span>
                    )}
                  </div>
                </h3>
              </Link>

              <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-300">
                {resource.description}
              </div>

              <span
                className="group-hover:text-lead-400 absolute right-6 top-6 text-zinc-300"
                aria-hidden="true"
              >
                <Link
                  href={resource.href}
                  className="cursor-pointer focus:outline-none"
                  target={resource.target}
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </Link>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
