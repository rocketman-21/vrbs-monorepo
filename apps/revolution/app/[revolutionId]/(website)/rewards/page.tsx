import "server-only";

import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { getUser } from "@cobuild/libs/user/server";
import HorizontalMenu, { HorizontalMenuItem } from "@cobuild/ui/atoms/HorizontalMenu";
import { NetworkLogo } from "@cobuild/ui/molecules/NetworkLogo/NetworkLogo";
import Link from "next/link";
import { Suspense } from "react";
import { RewardsClaim } from "./components/RewardsClaim";
import { SplitStats } from "./components/SplitStats";
import { SplitsGrid } from "./components/SplitsGrid";

interface Props {
  params: {
    revolutionId: string;
  };
  searchParams: {
    tab?: string;
    page?: string;
  };
}

export default async function RewardsPage(props: Props) {
  const { params, searchParams } = props;
  const { revolutionId } = params;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution || !revolution.addresses || !revolution.points) return null;

  const user = await getUser(revolutionId);

  const { tab = user ? "user" : "all" } = searchParams;

  const { chainId, addresses, name } = revolution;

  if (!addresses.splitsCreator) return null;

  return (
    <>
      <section className="mx-auto mt-24 flex w-full max-w-7xl flex-col px-4 md:mt-32 md:flex-row md:items-center md:justify-between md:space-x-12 lg:px-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            {revolution.name} rewards
          </h2>
          <div className="mt-2.5 space-y-1.5 text-zinc-500">
            <p>
              View your rewards and withdraw funds on
              <NetworkLogo chainId={chainId} showLabel className="ml-2.5 align-bottom" />.
            </p>
            <Suspense>
              <SplitStats
                chainId={chainId}
                splitsCreator={addresses.splitsCreator}
                entityName={name}
              />
            </Suspense>
          </div>
        </div>
        <RewardsClaim chainId={chainId} splitsCreator={addresses.splitsCreator} user={user} />
      </section>

      <section className="mt-12 bg-zinc-100 py-12">
        <div className="mx-auto w-full max-w-7xl space-y-6 px-4 lg:px-6">
          <HorizontalMenu size="xl">
            {user && (
              <Link href={`/${revolutionId}/rewards?tab=user`}>
                <HorizontalMenuItem isActive={tab === "user"}>My splits</HorizontalMenuItem>
              </Link>
            )}
            <Link href={`/${revolutionId}/rewards?tab=all`}>
              <HorizontalMenuItem isActive={tab === "all"}>All splits</HorizontalMenuItem>
            </Link>
          </HorizontalMenu>

          <SplitsGrid
            revolutionId={revolutionId}
            address={user && tab === "user" ? user : undefined}
            page={page}
          />
        </div>
      </section>
    </>
  );
}
