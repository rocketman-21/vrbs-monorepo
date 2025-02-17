"use client";

import { IRevolution, Serialized } from "@cobuild/database/types";
import { getRevolutionSocials } from "app/libs/social";
import { useRevolution } from "app/libs/useRevolution";
import clsx from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { Vrbie } from "./Vrbie";

const navigation = (revolution: Serialized<IRevolution>) => ({
  main: [
    ...(revolution.hasAuction ? [{ name: "Current Auction", href: "auction" }] : []),
    ...(!!revolution.cultureIndex ? [{ name: "Art Race", href: "creations" }] : []),
    ...(revolution.hasAuction ? [{ name: "FAQ", href: "faq" }] : []),
    ...(revolution.config.plausibleEmbedAuthToken
      ? [{ name: "Growth Metrics", href: "growth" }]
      : []),
  ],
  creators: revolution.addresses
    ? [
        { name: "Contests", href: "contests" },
        ...(revolution.hasGrants ? [{ name: "Grants", href: "grants" }] : []),
        ...(revolution.hasSplits ? [{ name: "Rewards", href: "rewards" }] : []),
        { name: "Contracts", href: "?viewContracts=true" },
        ...(revolution.config.brandResources
          ? [{ name: "Brand resources", href: revolution.config.brandResources }]
          : []),
      ]
    : [],
  dao: [
    { name: "Proposals", href: "dao" },
    { name: "Drafts", href: "dao/drafts" },
    { name: "Ideas", href: "dao/ideas" },
  ],
});

export function Footer() {
  const segments = useSelectedLayoutSegments();
  const revolution = useRevolution();
  const { revolutionId, socialLinks, name, config, dao, hasSplits } = revolution;

  const segment = segments[0];
  const isCreationsPage = segment === "creations" && segments.length === 1;
  const isDaoPage = segment === "dao";

  const socials = getRevolutionSocials(socialLinks);

  const showVrbie = revolutionId === "vrbs";

  const links = navigation(revolution);

  const showGovernance = !config.hiddenMenuItems?.includes("dao");

  return (
    <footer className={clsx("bg-card", { hidden: isCreationsPage || isDaoPage })}>
      <div className="mx-auto max-w-screen-2xl px-4 pb-12 lg:px-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:pr-8">
          <div
            className={clsx("relative flex flex-col max-sm:order-last", {
              "justify-end overflow-hidden": showVrbie,
              "justify-start pt-16": !showVrbie,
            })}
          >
            {showVrbie && <Vrbie />}
            {!showVrbie && (
              <div className="flex items-center">
                <Image
                  src={config.logoUrl}
                  alt={name}
                  width={200}
                  height={120}
                  className="mr-2.5 h-8 w-auto"
                />
                <h5 className="font-medium">{name}</h5>
              </div>
            )}
          </div>
          <div
            className={clsx("grid grid-cols-2 gap-8 pb-4 pt-8 lg:gap-28 lg:py-16", {
              "lg:grid-cols-3": hasSplits && showGovernance,
            })}
          >
            <LinkGroup name={name} links={links.main} revolutionId={revolutionId} />

            {showGovernance && (
              <LinkGroup name="DAO" links={links.dao} revolutionId={revolutionId} />
            )}

            {hasSplits && (
              <LinkGroup name="Creators" links={links.creators} revolutionId={revolutionId} />
            )}
          </div>
        </div>

        <div className="border-t border-zinc-200 pt-6 md:flex md:items-center md:justify-between dark:border-zinc-600">
          <div className="flex space-x-6 md:order-2">
            {socials.map(social => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="nofollow noreferrer noopener"
                className="hover:text-lead-400 dark:hover:text-lead-300 text-zinc-400 duration-75"
              >
                <social.Icon className="size-6" aria-label={social.name} />
              </a>
            ))}
          </div>
          <p className="text-sm text-zinc-500 max-sm:mt-8 md:order-1 dark:text-zinc-400">
            {new Date().getFullYear()} {dao?.name || name}. No Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function LinkGroup(props: {
  name: string;
  revolutionId: string;
  links: { name: string; href: string }[];
}) {
  const { name, links, revolutionId } = props;
  return (
    <div>
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{name}</h3>
      <ul role="list" className="mt-3 space-y-4 lg:mt-6">
        {links.map(item => (
          <li key={item.name}>
            <Link
              href={item.href.startsWith("http") ? item.href : `/${revolutionId}/${item.href}`}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              className="hover:text-lead-500 dark:hover:text-lead-200 text-sm text-zinc-600 duration-75 dark:text-zinc-400"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
