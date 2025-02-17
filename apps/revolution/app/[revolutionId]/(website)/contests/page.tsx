import { Goals } from "@cobuild/database/models/revolution/goals/Goals";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { Button } from "@cobuild/ui/atoms/Button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GoalBanner } from "../goals/[slug]/components/GoalBanner";
import { ContestsList } from "./components/ContestsList";

interface Props {
  params: { revolutionId: string };
}

export default async function BuildPage(props: Props) {
  const { revolutionId } = props.params;

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution) return notFound();

  const goals = await Goals().getForRevolution(revolutionId);

  return (
    <main className="mt-24 md:mt-28">
      <section className="mx-auto max-w-7xl px-4 pt-10 lg:px-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-center dark:text-zinc-100">
            Participate in contests
          </h2>
          <p className="mt-4 max-w-3xl text-pretty text-zinc-600 lg:mx-auto lg:text-center lg:text-lg lg:leading-7 dark:text-zinc-300">
            We all choose goals to work on. Each goal has a place for you to help. You can join
            anytime and contribute in any way you want, and our community will reward you.
          </p>
        </div>
      </section>

      <div className="mx-auto mt-12 max-w-7xl space-y-12 sm:px-6 lg:px-8">
        {goals.map(goal => (
          <GoalBanner key={goal.slug} goal={goal} />
        ))}
      </div>

      <Suspense>
        <div className="mt-16">
          <ContestsList revolutionId={revolutionId} />
        </div>
      </Suspense>

      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          What&apos;s next?
          <br />
          Anyone can decide!
        </h2>
        <div className="mt-10 flex gap-x-6 max-sm:flex-col max-sm:space-y-2.5 lg:items-center">
          <Link href={`/${revolutionId}/contests/create`}>
            <Button size="lg">Create a new contest</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
