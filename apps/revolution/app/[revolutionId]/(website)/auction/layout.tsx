import { database } from "@cobuild/database";
import { Auctions } from "@cobuild/database/models/revolution/auctions/Auctions";
import { Drops } from "@cobuild/database/models/revolution/drops/Drops";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { nonNullable, serializeSync } from "@cobuild/database/utils";
import { getBalanceInEth } from "@cobuild/libs/web3/balance";
import { Button } from "@cobuild/ui/atoms/Button";
import Skeleton from "@cobuild/ui/atoms/Skeleton";
import { Faq } from "app/components/faq/Faq";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PropsWithChildren, Suspense } from "react";
import { ChannelUpdates } from "../grants/components/ChannelUpdates";
import { DropCard } from "../impact/components/DropCard";
import { CreationMediaGrid } from "./components/CreationMediaGrid";
import { About } from "./components/content/About";
import { Mission } from "./components/content/Mission";
import { Points } from "./components/content/Points";
import { RevolutionDiagram } from "./components/diagram/RevolutionDiagram";
import { getVotingPower } from "app/libs/vote-power/votingPower";
import { getUser } from "@cobuild/libs/user/server";

type Props = PropsWithChildren<{ params: { revolutionId: string } }>;

export const dynamic = "force-dynamic";
export const revalidate = 0;

const show_builder_updates = ["vrbs", "grounds", "characters"];
const show_impact = ["vrbs"];
const show_grants_flow = ["vrbs"];

export default async function AuctionLayout(props: Props) {
  const { revolutionId } = props.params;
  const [revolution, user] = await Promise.all([
    Revolutions().getById(revolutionId),
    getUser(revolutionId),
  ]);

  const userVotingPower = user ? await getVotingPower(user, revolutionId) : "0";

  if (!revolution || !revolution.addresses || !revolution.auction) notFound();

  const { addresses, chainId, auction, config, points, descriptor, farcasterChannelId, name } =
    revolution;

  if (!addresses.auction || !addresses.cultureIndex || !addresses.pointsEmitter) notFound();

  const drops = show_impact ? Drops().getForRevolution(revolutionId, 1, 8) : [];

  const submissions = unstable_cache(
    () =>
      database.submission.findMany({
        where: {
          thumbnailUrl: { not: null },
          isHidden: { not: true },
          contractAddress: addresses.cultureIndex,
        },
        orderBy: { createdAt: "desc" },
        select: { thumbnailUrl: true, slug: true },
        take: 100,
      }),
    [addresses.cultureIndex],
    { revalidate: 3600, tags: [`submissions-${addresses.cultureIndex}`] },
  );

  const paidToCreators = Auctions().getTotalPaidToCreators(
    addresses.auction,
    addresses.pointsEmitter,
    chainId,
    auction.creatorPayment,
  );

  const hasVotes = Number(userVotingPower) / 10 ** 18 < 10;

  return (
    <main className="relative">
      <div className="relative overflow-hidden pb-10 pt-20 lg:pt-28">{props.children}</div>

      {show_grants_flow.includes(revolutionId) && hasVotes && (
        <div className="max-sm:hidden">
          <Suspense>
            <RevolutionDiagram revolutionId={revolutionId} />
          </Suspense>
        </div>
      )}

      {show_impact.includes(revolutionId) && (
        <section className="bg-zinc-50 py-16 md:pb-20 dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
                Mint our impact
              </h2>
              <p className="mt-2 text-base text-zinc-600 md:text-lg dark:text-zinc-400">
                Support {name} builders
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
              <Suspense fallback={<Skeleton height={620} count={4} square rounded />}>
                {(await drops).map(drop => (
                  <DropCard key={drop.id} drop={drop} revolutionName={revolution.name} />
                ))}
              </Suspense>
            </div>

            <div className="mt-12 space-x-4 text-center">
              <Link href={`/${revolutionId}/impact`}>
                <Button size="lg" color="outline">
                  View all
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {farcasterChannelId && show_builder_updates.includes(revolutionId) && (
        <Suspense>
          <ChannelUpdates channelId={farcasterChannelId} revolutionId={revolutionId} />
        </Suspense>
      )}

      <Suspense fallback={<Skeleton height={620} count={2} />}>
        <About
          creationsGrid={
            <Suspense>
              <div className="border-lead-600 inline-block aspect-square overflow-hidden rounded-xl border-8 border-double p-[3px] shadow md:hidden">
                {revolutionId !== "grounds" && (
                  <CreationMediaGrid
                    minImageRowCount={Math.min(Math.sqrt((await submissions()).length), 9)}
                    artPieces={(await submissions()).map(s => ({
                      image: s.thumbnailUrl as string,
                      url: `/${revolutionId}/creations/${s.slug}`,
                      key: s.slug,
                    }))}
                    placeholder={config.auctionPreLaunchPlaceholderImage}
                  />
                )}
              </div>
            </Suspense>
          }
          pointsName={points?.name || ""}
          creatorPercentage={auction.creatorRateBPS / 100}
          revolutionId={revolutionId}
          tokenName={descriptor?.tokenNamePrefix.trim() || ""}
          images={
            revolutionId !== "grounds"
              ? (await submissions()).map(s => s.thumbnailUrl).filter(nonNullable)
              : []
          }
          earnings={await paidToCreators}
        />
      </Suspense>
      <Suspense>
        <Mission
          purpose={revolution.dao?.purpose || ""}
          revolutionId={revolutionId}
          stats={{
            treasury: await getBalanceInEth(revolution.treasury || []),
          }}
        />
      </Suspense>
      <Points revolutionId={revolutionId} />

      <Faq revolutionId={revolutionId} revolution={serializeSync(revolution)} />
    </main>
  );
}
