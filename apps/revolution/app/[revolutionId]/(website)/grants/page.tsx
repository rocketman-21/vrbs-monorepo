import { Grants } from "@cobuild/database/models/revolution/grants/Grants";
import { Pools } from "@cobuild/database/models/revolution/pools/Pools";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { VRBS_GRANTS_PROXY } from "@cobuild/database/models/revolution/revolutions/addresses";
import { serializeMany } from "@cobuild/database/utils";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { getUser } from "@cobuild/libs/user/server";
import { Button } from "@cobuild/ui/atoms/Button";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GrantsDiagram } from "./components/GrantsDiagram";
import { GrantsList } from "./components/GrantsList";
import { Intro } from "./components/Intro";
import { Numbers } from "./components/Numbers";
import { Payments } from "./components/Payments";
import { Steps } from "./components/Steps";

interface Props {
  params: {
    revolutionId: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { revolutionId } = params;
  const { name } = getRevolutionConfig(revolutionId);

  return {
    title: `${name} Grants`,
    description:
      "An unique, community-driven program designed to support and recognize builders. Fully decentralized, transparent, and permissionless.",
  };
}

export default async function GrantsPage({ params }: Props) {
  const { revolutionId } = params;

  const [grants, revolution, user] = await Promise.all([
    Grants().getTopLevel(revolutionId),
    Revolutions().getById(revolutionId),
    getUser(revolutionId),
  ]);

  if (!revolution) return notFound();

  const votes = user ? await Pools().getVotesForUser(user, VRBS_GRANTS_PROXY) : [];

  return (
    <section className="relative mx-auto mt-20 w-full px-0.5 md:mt-24 lg:px-6 2xl:max-w-screen-2xl">
      <Intro revolutionId={revolutionId} />

      <GrantsList
        grants={await serializeMany(grants, ["members"])}
        revolutionId={revolutionId}
        votes={votes}
      />

      <div className="max-sm:hidden">
        <Suspense>
          <GrantsDiagram revolutionId={revolutionId} />
        </Suspense>
      </div>

      <Steps
        revolutionName={revolution.name}
        tokenName={revolution.token?.name || ""}
        pointsName={revolution.points?.name || ""}
        grantsPercentage={(revolution.pointsEmitter?.grantsRateBps || 0) / 100}
      />

      <Suspense>
        <Numbers revolutionId={revolutionId} />
      </Suspense>

      <Suspense>
        <Payments revolutionId={revolutionId} />
      </Suspense>

      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          Shape the future of {revolution.name}.
          <br />
          Start building.
        </h2>
        <div className="mt-10 flex gap-x-6 max-sm:flex-col max-sm:space-y-2.5 lg:items-center">
          <Link href={`/${revolutionId}/grants/apply`}>
            <Button size="lg">Apply for a grant</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
