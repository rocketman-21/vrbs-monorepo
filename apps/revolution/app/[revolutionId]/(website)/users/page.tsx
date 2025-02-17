import { database } from "@cobuild/database";
import { Grants } from "@cobuild/database/models/revolution/grants/Grants";
import { GrowthMetrics } from "@cobuild/database/models/revolution/growth/GrowthMetrics";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { Profiles } from "@cobuild/database/models/social/Profiles";
import { calculateUserSalary } from "@cobuild/libs/revolution/salary";
import { Button } from "@cobuild/ui/atoms/Button";
import Skeleton from "@cobuild/ui/atoms/Skeleton";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BuilderCard } from "./components/BuilderCard";
import { FilterDropdown, getResidencyFilters, parseFilter } from "./components/FilterDropdown";
import { OrderByDropdown, parseOrderBy } from "./components/OrderByDropdown";
import { getResidentLabel } from "./components/ResidencyBadge";
import { RevenueComment } from "./components/RevenueComment";
import { getUser } from "@cobuild/libs/user/server";

interface Props {
  params: {
    revolutionId: string;
  };
  searchParams: {
    filter?: string;
    orderBy?: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { revolutionId } = params;

  const revolution = await Revolutions().getById(revolutionId);

  if (!revolution) notFound();

  return {
    title: `${revolution.name} Builders`,
    description: `Explore our community of builders`,
  };
}

export default async function UsersPage(props: Props) {
  const { revolutionId } = props.params;

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution || !revolution.addresses) return notFound();
  const { addresses, name } = revolution;

  if (!addresses.splitsCreator) return notFound();

  const [grants, revenueMetrics, stories, user] = await Promise.all([
    Grants().getAll(revolutionId),
    GrowthMetrics().getRevenueMetricsForSplit(addresses.splitsCreator),
    getStories(revolutionId),
    getUser(revolutionId),
  ]);

  const filters = getResidencyFilters(grants);
  const filter = parseFilter(props.searchParams.filter, filters);
  const orderBy = parseOrderBy(props.searchParams.orderBy);
  const searchParams = { filter, orderBy };

  const builders = Profiles().getMany(grants.filter(g => g.isApproved).flatMap(g => g.team));

  return (
    <main>
      <section className="dark:bg-page relative mt-20 bg-zinc-100 py-12 md:pb-16">
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-6">
          <h2 className="mb-2.5 text-3xl font-semibold tracking-tight text-zinc-900 lg:text-6xl dark:text-zinc-50">
            {name} Builders
          </h2>

          <RevenueComment revolution={revolution} />

          <p className="mt-4 flex items-center space-x-2.5">
            <Link href={`/${revolutionId}/growth`}>
              <Button color="outline">Growth metrics &raquo;</Button>
            </Link>

            <Link href={`/${revolutionId}/opportunities`}>
              <Button color="outline">Open opportunities &raquo;</Button>
            </Link>
          </p>

          <div className="mt-12 flex items-center justify-between space-x-4 md:mt-16">
            <FilterDropdown searchParams={searchParams} filters={filters} />
            <OrderByDropdown searchParams={searchParams} />
          </div>

          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Suspense fallback={<Skeleton count={4} height={320} rounded />}>
              {(await builders)
                .map(profile => {
                  const userGrants = grants.filter(
                    g =>
                      g.isApproved &&
                      !g.isApplicable &&
                      !g.isOpenGrantPool &&
                      g.team.includes(profile.address),
                  );

                  return {
                    profile,
                    userGrants,
                    salary: calculateUserSalary(userGrants),
                    earnedForDao: revenueMetrics
                      .filter(r => r.address === profile.address)
                      .reduce((acc, r) => acc + r.totalRevenue, 0),
                    residency: grants.find(
                      g =>
                        userGrants.find(ug => ug.isApproved && ug.isApplication)?.parentContract ===
                        g.contractAddress,
                    ),
                  };
                })
                .filter(b => {
                  if (!filter) return true;
                  return b.residency && getResidentLabel(b.residency.title) === filter;
                })
                .sort((a, b) => {
                  if (a.profile.address === user) return -1;
                  if (b.profile.address === user) return 1;
                  switch (orderBy) {
                    case "daoEarned":
                      return b.earnedForDao - a.earnedForDao;
                    case "totalEarned":
                      return b.salary.totalEarned - a.salary.totalEarned;
                    case "username":
                      return a.profile.displayUsername.localeCompare(b.profile.displayUsername);
                  }
                })
                .map(b => (
                  <BuilderCard
                    key={b.profile.address}
                    profile={b.profile}
                    grants={b.userGrants}
                    residency={b.residency}
                    revolutionId={revolutionId}
                    earnedForDao={b.earnedForDao}
                    salary={b.salary}
                    stories={stories.filter(s => s.team.includes(b.profile.address)).slice(0, 10)}
                  />
                ))}
            </Suspense>
          </dl>
        </div>
      </section>
    </main>
  );
}

const getStories = unstable_cache(
  async (revolutionId: string) => {
    return await database.story.findMany({
      where: {
        revolutionId,
        isPublished: true,
        // alloProfileId: { not: null },
      },
      orderBy: { updatedAt: "desc" },
      take: 150,
      select: {
        team: true,
        slug: true,
        thumbnailUrl: true,
        title: true,
      },
    });
  },
  undefined,
  { revalidate: 1800, tags: ["story"] },
);
