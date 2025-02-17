import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EarnedForDaoLeaderboard } from "./components/EarnedForDaoLeaderboard";
import GrowthDashboard from "./components/GrowthDashboard";
import { ImpactLeaderboard } from "./components/ImpactLeaderboard";
import { RevenueStats } from "./components/RevenueStats";
import { Suspense } from "react";
import Skeleton from "@cobuild/ui/atoms/Skeleton";

interface PageProps {
  params: {
    revolutionId: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { revolutionId } = params;
  const config = getRevolutionConfig(revolutionId);

  return {
    title: `Growth Metrics | #${config.hashtag}`,
    description: "Tap in to your community. Help grow the revolution.",
  };
}

export default async function GrowthPage({ params }: PageProps) {
  const { revolutionId } = params;
  const revolution = await Revolutions().getById(revolutionId);

  if (!revolution) return notFound();

  return (
    <main className="mt-28">
      {revolution.addresses && (
        <Suspense
          fallback={
            <div className="mx-auto w-full max-w-[640px] space-y-4">
              <Skeleton height={48} count={2} />
            </div>
          }
        >
          <RevenueStats revolution={revolution} />
        </Suspense>
      )}

      <div className="dark:bg-page mt-16 bg-zinc-50 py-16">
        <section className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:px-6">
          <EarnedForDaoLeaderboard revolution={revolution} />
          <ImpactLeaderboard revolution={revolution} />
        </section>
      </div>

      {revolution.config.plausibleEmbedAuthToken && (
        <div className="dark:bg-page overflow-hidden bg-zinc-50">
          <section className="mx-auto w-full max-w-screen-xl">
            <GrowthDashboard revolutionId={revolutionId} />
          </section>
        </div>
      )}
    </main>
  );
}
