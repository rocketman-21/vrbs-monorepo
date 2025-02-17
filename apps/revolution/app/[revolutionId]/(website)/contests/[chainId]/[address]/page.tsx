import "server-only";

import { Goals } from "@cobuild/database/models/revolution/goals/Goals";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { getContestData } from "@cobuild/libs/revolution/contest";
import { markdownToPlainText } from "@cobuild/libs/utils/text";
import { etherscanNetworkUrl } from "@cobuild/libs/utils/url";
import { convertIpfsToHttp } from "@cobuild/libs/web3/utils";
import { Ether } from "@cobuild/ui/atoms/Ether";
import { GoalDarkMode } from "app/[revolutionId]/(website)/goals/[slug]/components/GoalDarkMode";
import { Countdown } from "app/components/Countdown";
import { CreationsGrid } from "app/components/creations/CreationsGrid/CreationsGrid";
import { generateOpenGraphSeoContent } from "app/libs/seo/utils/opengraphSeoMetadata";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CSSProperties } from "react";
import { getAddress } from "viem";
import { ContestDescription } from "./components/ContestDescription";
import { ContestsFilter } from "./components/ContestFilter";
import { SubmitModal } from "./components/SubmitModal";
import { Contests } from "@cobuild/database/models/revolution/contests/Contests";

const CreateFloatingButton = dynamic(
  () => import("app/components/creations/CreateFloatingButton"),
  {
    ssr: false,
  },
);

interface Props {
  searchParams?: {
    filter?: "next-up" | "recent";
    creator?: string;
  };
  params: {
    address: string;
    chainId: string;
    revolutionId: string;
  };
}

export default async function ContestPage(props: Props) {
  const { address, chainId } = props.params;

  const contest = await Contests().getByAddress(address, Number(chainId));
  if (!contest) notFound();

  const { filter = contest.paidOut ? "auctioned" : "next-up", creator } = props.searchParams || {};

  const goal = contest.goal ? await Goals().getBySlug(contest.goal) : null;

  const { cultureIndex, name, description, status } = contest;

  const imageUrl = contest.imageUrl || goal?.image.url;

  return (
    <div
      style={
        {
          "--color-goal": goal?.colors.background,
        } as CSSProperties
      }
      className="relative mx-auto mt-24 w-full max-w-screen-2xl px-4 lg:mt-28 lg:px-6"
    >
      {status === "active" && <SubmitModal cultureIndex={contest.cultureIndex} />}
      {goal && <GoalDarkMode enabled={goal.darkMode} />}
      <header
        className="bg-lead-100 rounded-lg p-2.5 py-3 lg:p-4"
        style={{ color: goal?.colors.text, backgroundColor: goal?.colors.background }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:space-x-5">
          <div className="flex items-center space-x-2.5 pr-8 lg:space-x-5">
            {imageUrl && (
              <div
                className="shrink-0 rounded-lg"
                style={{ backgroundColor: goal?.image.background }}
              >
                <Image
                  src={imageUrl}
                  alt={name}
                  width={144}
                  height={144}
                  className="size-20 rounded-lg lg:size-36"
                />
              </div>
            )}
            <div>
              {goal && (
                <h3 className="mb-2.5 text-xs lg:mb-4 lg:text-sm">
                  <Link
                    href={`/${goal.revolutionId}/goals/${goal.slug}`}
                    className="hover:underline"
                  >
                    {goal.title} &raquo;
                  </Link>
                </h3>
              )}
              <h1 className="text-xl font-semibold lg:text-4xl">{name}</h1>
              <ContestDescription contest={contest} description={description} />
            </div>
          </div>
          <div className="flex shrink-0 items-center space-x-12 max-lg:mt-4 lg:pr-8">
            {status === "active" && (
              <div className="flex flex-col gap-1">
                <dt className="text-xs md:text-base">Accepting submissions</dt>
                <dd className="text-xl font-medium tracking-tight lg:text-3xl">
                  <Countdown targetTime={new Date(contest.endTime * 1000).toISOString()} />
                </dd>
              </div>
            )}
            {status !== "active" && (
              <div className="flex flex-col gap-1">
                <dt className="text-xs md:text-base">Status</dt>
                <dd className="text-xl font-medium capitalize tracking-tight lg:text-3xl">
                  {status}
                </dd>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <dt className="text-xs md:text-base">Active pool</dt>
              <dd className="text-xl font-medium tracking-tight lg:text-3xl">
                <a
                  href={etherscanNetworkUrl(contest.address, contest.chainId, "address")}
                  target="_blank"
                  className="duration-100 hover:opacity-75"
                >
                  <Ether amount={BigInt(contest.balance)} symbol="Ξ" />
                </a>
              </dd>
            </div>
          </div>
        </div>
      </header>
      <div className="bg-page sticky top-0 z-[2] py-2.5 max-sm:mt-2.5 lg:py-4">
        <ContestsFilter filter={filter} contest={contest} />
      </div>
      <div className="relative mx-auto mt-4 w-full max-w-screen-2xl pb-10">
        <CreationsGrid
          contractAddress={cultureIndex.address}
          filter={filter}
          creatorAddress={creator}
          columns={5}
          contest={contest}
        />

        <div className="fixed bottom-6 left-4 z-30 lg:hidden">
          <CreateFloatingButton filter={filter} modal="submit" />
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hashtag, defaultSeo } = getRevolutionConfig(params.revolutionId);

  const contest = await getContestData(getAddress(params.address), Number(params.chainId));
  if (!contest) notFound();

  const image = convertIpfsToHttp(contest.cultureIndex?.template);

  return {
    title: contest.cultureIndex.name || `Creations | #${hashtag}`,
    description: markdownToPlainText(
      contest.cultureIndex.description || defaultSeo.description || "",
    ),
    openGraph: generateOpenGraphSeoContent(image, 500, 500),
  };
}
