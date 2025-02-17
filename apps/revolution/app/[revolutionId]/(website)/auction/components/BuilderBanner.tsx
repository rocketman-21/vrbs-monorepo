import { Grants } from "@cobuild/database/models/revolution/grants/Grants";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { Profiles } from "@cobuild/database/models/social/Profiles";
import { AnimatedEarnings } from "app/components/AnimatedEarnings";
import sumBy from "lodash/sumBy";
import Image from "next/image";
import pluralize from "pluralize";
import { Suspense } from "react";
import { formatEther } from "viem";
import { BuilderUpdateReminder } from "./BuilderUpdateReminder";

interface Props {
  user: `0x${string}`;
  revolutionId: string;
}

export async function BuilderBanner(props: Props) {
  const { user, revolutionId } = props;

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution) return null;

  const grants = await Grants().getForUser(revolutionId, user);
  if (!grants || grants.length === 0) return null;

  const monthlyFlowRate = sumBy(grants, g => g.monthlyFlowRatePerMember);
  const totalEarned = sumBy(grants, g => g.poolBalance.totalEarnedPerMember);

  const profile = await Profiles().get(user);
  const isEvening = new Date().getHours() >= 19;

  return (
    <div className="bg-lead-500 relative isolate overflow-hidden rounded-3xl px-6 py-12 shadow-xl md:px-16">
      <div className="md:flex md:items-center md:justify-between">
        <div>
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {isEvening ? "good evening" : "gm"}{" "}
            <strong className="font-medium">{profile.displayUsername}</strong>{" "}
            <span className="text-white">🤝</span>
          </h2>
          <p className="text-lead-50 mt-6 max-w-xl text-lg">
            Thank you for being part of{" "}
            {!grants[0].title.toLowerCase().startsWith("the") ? "the" : ""}{" "}
            {grants
              .slice(0, grants.length - 1)
              .map(g => g.title)
              .join(", ")}
            {grants.length > 1 ? ", and" : ""} {grants[grants.length - 1].title}{" "}
            {pluralize("grant", grants.length)}. Keep building!
          </p>
          <div className="mt-10 flex items-center gap-x-8">
            <a
              href={`https://warpcast.com/~/compose?channelKey=${revolution.farcasterChannelId}`}
              className="text-lead-900 hover:bg-lead-100 rounded-md bg-white px-4 py-2.5 text-base font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              target="_blank"
            >
              Post update
            </a>
            {revolution.farcasterChannelId && (
              <Suspense>
                <BuilderUpdateReminder user={user} channelId={revolution.farcasterChannelId} />
              </Suspense>
            )}
          </div>
        </div>

        <dl className="grid grid-cols-2 items-start gap-8 max-sm:mt-8 md:grid-cols-1">
          <div className="flex flex-col-reverse gap-1">
            <dt className="text-sm leading-7 text-white/80 md:text-base">Your salary</dt>
            <dd className="text-2xl font-medium tracking-tight text-white lg:text-3xl">
              {Intl.NumberFormat("en", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(Number(formatEther(BigInt(monthlyFlowRate * 12))))}
              <span className="text-lg">/yr</span>
            </dd>
          </div>
          <div className="flex flex-col-reverse gap-1">
            <dt className="text-sm leading-7 text-white/80 md:text-base">Earned so far</dt>
            <dd className="text-2xl font-medium tracking-tight text-white lg:text-3xl">
              <AnimatedEarnings
                earnings={totalEarned}
                flowRate={sumBy(grants, g => g.memberFlowRatePerMember)}
              />
            </dd>
          </div>
        </dl>
      </div>

      <Image
        src={revolution.config.grantsImage || "/images/vrbs/backdrop.jpeg"}
        alt=""
        width="1500"
        height="500"
        priority
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full select-none object-cover opacity-50 mix-blend-multiply"
      />
    </div>
  );
}
