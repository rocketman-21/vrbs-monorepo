import "server-only";

import { database } from "@cobuild/database";
import { IGoal } from "@cobuild/database/models/revolution/goals/IGoal";
import { nonNullable } from "@cobuild/database/utils";
import { Ether } from "@cobuild/ui/atoms/Ether";
import SvgTrophy from "@cobuild/ui/pixel-icons/Trophy";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import pluralize from "pluralize";
import { Suspense } from "react";

interface Props {
  goal: IGoal;
  withStats?: boolean;
}

export async function GoalBanner(props: Props) {
  const { goal, withStats } = props;
  const { revolutionId, colors, description, image, title, slug, pool } = goal;

  const submissionsCount = unstable_cache(
    () =>
      database.submission.count({
        where: {
          isHidden: { not: true },
          onchainSlug: { isSet: false },
          contractAddress: {
            in: goal.contests.map(contest => contest.cultureIndex.address).filter(nonNullable),
          },
        },
      }),
    [goal.revolutionId, goal.slug],
    { revalidate: 120, tags: [`submissions-${goal.slug}`] },
  );

  return (
    <div
      className="relative isolate grid overflow-hidden shadow-2xl md:grid-cols-2 md:rounded-2xl"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
      }}
    >
      <svg
        viewBox="0 0 1024 1024"
        className="absolute left-1/2 top-1/2 -z-10 size-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
        aria-hidden="true"
      >
        <circle cx={512} cy={512} r={512} fill="url(#radial-gradient)" fillOpacity="0.75" />
        <defs>
          <radialGradient id="radial-gradient">
            <stop stopColor={colors.background} />
            <stop offset={1} stopColor="#fff" />
          </radialGradient>
        </defs>
      </svg>
      <div className="flex flex-col items-start px-4 py-10 lg:px-14 lg:py-16">
        <h1 className="flex items-center text-sm font-medium uppercase lg:text-[15px]">
          <SvgTrophy className="mr-1.5 size-5" />
          Active Rewards: <Ether amount={BigInt(pool)} symbol="ETH" />
        </h1>
        <h2 className="mt-12 text-balance text-3xl font-bold tracking-tight lg:text-5xl">
          {withStats ? (
            title
          ) : (
            <Link
              href={`/${revolutionId}/goals/${slug}`}
              className="hover:underline hover:underline-offset-4"
            >
              {title}
            </Link>
          )}
        </h2>
        <p className="mb-10 mt-6 text-pretty leading-relaxed lg:text-lg">{description}</p>
        {!withStats && (
          <Link
            href={`/${revolutionId}/goals/${slug}`}
            className="rounded-md bg-white px-3.5 py-2.5 text-[15px] font-semibold text-zinc-900 shadow-sm hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            View {goal.contests.length} {pluralize("contest", goal.contests.length)}
          </Link>
        )}
        {withStats && (
          <dl className="mt-6 grid grid-cols-3 items-start gap-4 lg:mt-12 lg:gap-8">
            <div className="flex flex-col-reverse gap-1">
              <dt className="text-sm leading-7 md:text-base">Launch</dt>
              <dd className="text-2xl font-medium tracking-tight lg:text-3xl">{goal.launch}</dd>
            </div>
            <div className="flex flex-col-reverse gap-1">
              <dt className="text-sm leading-7 md:text-base">
                {pluralize("Contest", goal.contests.length)}
              </dt>
              <dd className="text-2xl font-medium tracking-tight lg:text-3xl">
                {goal.contests.length}
              </dd>
            </div>
            <div className="flex flex-col-reverse gap-1">
              <dt className="text-sm leading-7 md:text-base">Submissions</dt>
              <dd className="text-2xl font-medium tracking-tight lg:text-3xl">
                <Suspense fallback="?">{await submissionsCount()}</Suspense>
              </dd>
            </div>
          </dl>
        )}
      </div>
      <div className="flex max-sm:order-first lg:pt-14">
        <div
          className="flex grow items-center justify-center lg:rounded-l-2xl lg:rounded-br-2xl"
          style={{ backgroundColor: image.background }}
        >
          <Image
            src={image.url}
            alt={title}
            width={640}
            height={320}
            className="h-full max-h-[70%] w-full max-w-[75%] object-contain"
          />
        </div>
      </div>
    </div>
  );
}
