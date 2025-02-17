import { Goals } from "@cobuild/database/models/revolution/goals/Goals";
import * as motion from "@cobuild/ui/atoms/Motion";
import { getGoalSeo } from "app/libs/seo/goalSeo";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CSSProperties } from "react";
import { ContestCard } from "./components/ContestCard";
import { GoalBanner } from "./components/GoalBanner";
import { GoalDarkMode } from "./components/GoalDarkMode";
import { Steps } from "./components/Steps";

interface Props {
  params: {
    revolutionId: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  const goal = await Goals().getBySlug(slug);
  if (!goal) return notFound();

  return getGoalSeo(goal);
}

export default async function GoalPage(props: Props) {
  const { slug, revolutionId } = props.params;

  const goal = await Goals().getBySlug(slug);
  if (!goal || revolutionId !== goal.revolutionId) notFound();

  return (
    <main
      style={
        {
          "--color-goal": goal.colors.background,
        } as CSSProperties
      }
    >
      <GoalDarkMode enabled={goal.darkMode} />
      <div className="flex items-center pb-12 pt-24 lg:pb-24 lg:pt-28">
        <motion.div
          className="mx-auto max-w-screen-2xl space-y-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GoalBanner goal={goal} withStats />
        </motion.div>
      </div>

      <section className="mx-auto max-w-screen-2xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-24">
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="flex grow flex-col p-4 lg:col-span-2 lg:row-span-4 lg:p-6 lg:pl-14">
            <h2 className="text-4xl font-bold sm:text-7xl">{goal.tagline}</h2>
            <h3 className="mt-8 text-lg leading-relaxed lg:text-balance lg:text-2xl dark:text-zinc-300">
              1. Create your best work
              <br />
              <br />
              2. The community votes
              <br />
              <br />
              3. You get paid
            </h3>
          </div>

          {goal.contests.map((contest, index) => (
            <ContestCard
              key={contest.address}
              contest={contest}
              index={index}
              imageUrl={contest.imageUrl || goal.image.url}
            />
          ))}
        </div>
      </section>

      {slug === "base" && <Steps />}
    </main>
  );
}
